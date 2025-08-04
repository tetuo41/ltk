import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'regular', 'shorts', or 'all'
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const sortBy = url.searchParams.get('sort') || 'publishedAt'; // 'publishedAt', 'viewCount', 'likeCount'
    const sortOrder = url.searchParams.get('order') || 'desc'; // 'asc' or 'desc'

    // Read video data files
    const videosPath = join(process.cwd(), 'src/data/ltk-videos.json');
    const customVideosPath = join(process.cwd(), 'src/data/ltk-custom-videos.json');
    const metadataPath = join(process.cwd(), 'src/data/ltk-videos-metadata.json');

    const videosData = JSON.parse(readFileSync(videosPath, 'utf-8'));
    const customVideosData = JSON.parse(readFileSync(customVideosPath, 'utf-8'));
    const metadataData = JSON.parse(readFileSync(metadataPath, 'utf-8'));

    // Combine all videos
    let allVideos = [
      ...videosData.regular_videos,
      ...videosData.shorts,
      ...customVideosData.custom_videos.filter((video: any) => 
        metadataData.video_settings[video.id]?.isVisible !== false && video.isVisible !== false
      )
    ];

    // Filter by type
    if (type === 'regular') {
      allVideos = allVideos.filter(video => !video.isShort);
    } else if (type === 'shorts') {
      allVideos = allVideos.filter(video => video.isShort);
    }

    // Sort videos
    allVideos.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'viewCount':
          aValue = a.viewCount || 0;
          bValue = b.viewCount || 0;
          break;
        case 'likeCount':
          aValue = a.likeCount || 0;
          bValue = b.likeCount || 0;
          break;
        case 'publishedAt':
        default:
          aValue = new Date(a.publishedAt).getTime();
          bValue = new Date(b.publishedAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    // Apply limit
    const limitedVideos = allVideos.slice(0, limit);

    // Separate regular and shorts for response
    const regular_videos = limitedVideos.filter(video => !video.isShort);
    const shorts = limitedVideos.filter(video => video.isShort);

    return new Response(JSON.stringify({
      success: true,
      data: {
        regular_videos,
        shorts,
        total_count: allVideos.length,
        returned_count: limitedVideos.length,
        last_updated: videosData.last_updated,
        metadata: {
          filters_applied: { type, limit, sortBy, sortOrder },
          api_quota_used: videosData.metadata?.api_quota_used || 0,
          last_api_call: videosData.metadata?.last_api_call
        }
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600' // 5 minutes cache
      }
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch videos',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // For future use: manual video refresh
    return new Response(JSON.stringify({
      success: false,
      error: 'Not implemented',
      message: 'Manual refresh functionality will be implemented in admin panel'
    }), {
      status: 501,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};