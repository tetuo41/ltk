import type { APIRoute } from 'astro';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { searchLTKVideos } from '@/utils/youtubeApi';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check for admin authentication (simple password check)
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD}`;
    
    if (!authHeader || authHeader !== expectedAuth) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized',
        message: 'Admin authentication required'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = import.meta.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Configuration error',
        message: 'YouTube API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read current video data
    const videosPath = join(process.cwd(), 'src/data/ltk-videos.json');
    const metadataPath = join(process.cwd(), 'src/data/ltk-videos-metadata.json');
    
    let currentData;
    try {
      currentData = JSON.parse(readFileSync(videosPath, 'utf-8'));
    } catch {
      currentData = {
        last_updated: null,
        total_count: 0,
        regular_videos: [],
        shorts: [],
        metadata: { api_quota_used: 0, api_quota_limit: 10000 }
      };
    }

    let metadataConfig;
    try {
      metadataConfig = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    } catch {
      metadataConfig = { admin_config: { max_videos_per_update: 50 } };
    }

    // Fetch new videos from YouTube API
    const maxVideos = metadataConfig.admin_config?.max_videos_per_update || 50;
    const newVideoData = await searchLTKVideos(maxVideos);

    // Merge with existing data (avoid duplicates)
    const existingIds = new Set([
      ...currentData.regular_videos.map((v: any) => v.id),
      ...currentData.shorts.map((v: any) => v.id)
    ]);

    const newRegularVideos = newVideoData.regular_videos.filter(video => !existingIds.has(video.id));
    const newShorts = newVideoData.shorts.filter(video => !existingIds.has(video.id));

    // Update data structure
    const updatedData = {
      last_updated: new Date().toISOString(),
      total_count: currentData.regular_videos.length + currentData.shorts.length + newRegularVideos.length + newShorts.length,
      regular_videos: [...newRegularVideos, ...currentData.regular_videos].slice(0, 100), // Keep latest 100
      shorts: [...newShorts, ...currentData.shorts].slice(0, 100), // Keep latest 100
      metadata: {
        api_quota_used: (currentData.metadata?.api_quota_used || 0) + Math.ceil(maxVideos / 10), // Rough estimate
        api_quota_limit: 10000,
        last_api_call: new Date().toISOString(),
        next_scheduled_update: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours later
      }
    };

    // Write updated data to file
    writeFileSync(videosPath, JSON.stringify(updatedData, null, 2));

    return new Response(JSON.stringify({
      success: true,
      message: 'Videos refreshed successfully',
      data: {
        new_regular_videos: newRegularVideos.length,
        new_shorts: newShorts.length,
        total_videos: updatedData.total_count,
        api_quota_used: updatedData.metadata.api_quota_used,
        last_updated: updatedData.last_updated
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error refreshing videos:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Refresh failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: false,
    error: 'Method not allowed',
    message: 'Use POST method to refresh videos'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};