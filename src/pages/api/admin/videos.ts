import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { requireAuth } from '@/utils/adminAuth';

export const GET: APIRoute = async ({ request }) => {
  // Check authentication
  const authError = requireAuth(request.headers.get('authorization'));
  if (authError) return authError;

  try {
    const url = new URL(request.url);
    const includeCustom = url.searchParams.get('include_custom') === 'true';

    // Read video data files
    const videosPath = join(process.cwd(), 'src/data/ltk-videos.json');
    const customVideosPath = join(process.cwd(), 'src/data/ltk-custom-videos.json');
    const metadataPath = join(process.cwd(), 'src/data/ltk-videos-metadata.json');

    const videosData = JSON.parse(readFileSync(videosPath, 'utf-8'));
    const customVideosData = JSON.parse(readFileSync(customVideosPath, 'utf-8'));
    const metadataData = JSON.parse(readFileSync(metadataPath, 'utf-8'));

    let response: any = {
      success: true,
      data: {
        youtube_videos: {
          regular_videos: videosData.regular_videos || [],
          shorts: videosData.shorts || [],
          last_updated: videosData.last_updated,
          metadata: videosData.metadata
        },
        metadata_config: metadataData
      }
    };

    if (includeCustom) {
      response.data.custom_videos = customVideosData.custom_videos || [];
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching admin video data:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Data fetch failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  // Check authentication
  const authError = requireAuth(request.headers.get('authorization'));
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action, videoData, videoId } = body;

    switch (action) {
      case 'add_custom_video':
        return await addCustomVideo(videoData);
      
      case 'update_video_visibility':
        return await updateVideoVisibility(videoId, body.isVisible);
      
      case 'delete_custom_video':
        return await deleteCustomVideo(videoId);
      
      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid action',
          message: 'Supported actions: add_custom_video, update_video_visibility, delete_custom_video'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Error in admin video operation:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Operation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function addCustomVideo(videoData: any): Promise<Response> {
  try {
    const customVideosPath = join(process.cwd(), 'src/data/ltk-custom-videos.json');
    const customVideosData = JSON.parse(readFileSync(customVideosPath, 'utf-8'));

    const newVideo = {
      id: `custom-${Date.now()}`,
      title: videoData.title,
      description: videoData.description || '',
      thumbnail: videoData.thumbnail || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: videoData.duration || '0:00',
      publishedAt: new Date().toISOString(),
      channelId: 'custom',
      channelName: videoData.channelName || '手動追加',
      viewCount: parseInt(videoData.viewCount) || 0,
      likeCount: parseInt(videoData.likeCount) || undefined,
      tags: Array.isArray(videoData.tags) ? videoData.tags : [],
      isShort: videoData.isShort === true,
      url: videoData.url,
      isVisible: true,
      addedBy: 'admin',
      addedAt: new Date().toISOString(),
      notes: videoData.notes || ''
    };

    customVideosData.custom_videos.unshift(newVideo);
    customVideosData.metadata.total_custom_videos = customVideosData.custom_videos.length;
    customVideosData.metadata.last_added = new Date().toISOString();

    writeFileSync(customVideosPath, JSON.stringify(customVideosData, null, 2));

    return new Response(JSON.stringify({
      success: true,
      message: 'Custom video added successfully',
      data: { video: newVideo }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    throw new Error(`Failed to add custom video: ${error}`);
  }
}

async function updateVideoVisibility(videoId: string, isVisible: boolean): Promise<Response> {
  try {
    const metadataPath = join(process.cwd(), 'src/data/ltk-videos-metadata.json');
    const metadataData = JSON.parse(readFileSync(metadataPath, 'utf-8'));

    if (!metadataData.video_settings) {
      metadataData.video_settings = {};
    }

    metadataData.video_settings[videoId] = {
      ...metadataData.video_settings[videoId],
      isVisible,
      updatedAt: new Date().toISOString()
    };

    writeFileSync(metadataPath, JSON.stringify(metadataData, null, 2));

    return new Response(JSON.stringify({
      success: true,
      message: `Video visibility updated to ${isVisible ? 'visible' : 'hidden'}`,
      data: { videoId, isVisible }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    throw new Error(`Failed to update video visibility: ${error}`);
  }
}

async function deleteCustomVideo(videoId: string): Promise<Response> {
  try {
    const customVideosPath = join(process.cwd(), 'src/data/ltk-custom-videos.json');
    const customVideosData = JSON.parse(readFileSync(customVideosPath, 'utf-8'));

    const initialLength = customVideosData.custom_videos.length;
    customVideosData.custom_videos = customVideosData.custom_videos.filter(
      (video: any) => video.id !== videoId
    );

    if (customVideosData.custom_videos.length === initialLength) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Video not found',
        message: `Custom video with ID ${videoId} not found`
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    customVideosData.metadata.total_custom_videos = customVideosData.custom_videos.length;
    writeFileSync(customVideosPath, JSON.stringify(customVideosData, null, 2));

    return new Response(JSON.stringify({
      success: true,
      message: 'Custom video deleted successfully',
      data: { deletedVideoId: videoId }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    throw new Error(`Failed to delete custom video: ${error}`);
  }
}