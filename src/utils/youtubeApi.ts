// YouTube Data API v3 integration utilities

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  channelId: string;
  channelName: string;
  viewCount: number;
  likeCount?: number | undefined;
  tags?: string[];
  isShort: boolean;
  url: string;
}

export interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
  totalResults: number;
}

interface YouTubeSearchItem {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      high: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      default: { url: string; width: number; height: number };
    };
    channelTitle: string;
  };
}

interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    tags?: string[];
    thumbnails: {
      high: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      default: { url: string; width: number; height: number };
    };
  };
  contentDetails: {
    duration: string; // ISO 8601 format (PT4M13S)
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
  };
}

// YouTube API configuration
const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const MAX_RESULTS_PER_REQUEST = 50; // YouTube API limit
const RATE_LIMIT_DELAY = 100; // ms between requests

/**
 * Convert ISO 8601 duration to human-readable format
 * @param duration ISO 8601 duration (e.g., "PT4M13S")
 * @returns Formatted duration (e.g., "4:13")
 */
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Determine if a video is a YouTube Short based on duration and other factors
 * @param duration ISO 8601 duration string
 * @param title Video title
 * @param description Video description
 * @returns Boolean indicating if video is a short
 */
export function isYouTubeShort(duration: string, title: string = '', description: string = ''): boolean {
  // Parse duration to seconds
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Primary rule: 60 seconds or less
  if (totalSeconds <= 60) {
    return true;
  }

  // Secondary rules: Check for #Shorts hashtag or "shorts" keyword
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  const hasShortIndicator = 
    titleLower.includes('#shorts') ||
    titleLower.includes('#short') || 
    descLower.includes('#shorts') ||
    descLower.includes('#short');

  // Allow slightly longer videos (up to 90 seconds) if they have short indicators
  return totalSeconds <= 90 && hasShortIndicator;
}

/**
 * Search for YouTube videos with specific query
 * @param query Search query
 * @param maxResults Number of results to return (max 50)
 * @param pageToken Next page token for pagination
 * @returns Promise<YouTubeSearchResponse>
 */
export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 25,
  pageToken?: string
): Promise<YouTubeSearchResponse> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
    order: 'relevance',
    regionCode: 'JP',
    relevanceLanguage: 'ja'
  });

  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const url = `${YOUTUBE_API_BASE_URL}/search?${params}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      items: data.items || [],
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo?.totalResults || 0
    };
  } catch (error) {
    console.error('Error fetching YouTube search results:', error);
    throw error;
  }
}

/**
 * Get detailed information for specific video IDs
 * @param videoIds Array of video IDs
 * @returns Promise<YouTubeVideoDetails[]>
 */
export async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideoDetails[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  if (videoIds.length === 0) return [];

  const params = new URLSearchParams({
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(','),
    key: YOUTUBE_API_KEY
  });

  const url = `${YOUTUBE_API_BASE_URL}/videos?${params}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    throw error;
  }
}

/**
 * Enhanced search and process LTK-related videos with improved error handling
 * @param maxResults Maximum number of results
 * @returns Promise<{ regular_videos: YouTubeVideo[], shorts: YouTubeVideo[] }>
 */
export async function searchLTKVideos(maxResults: number = 50): Promise<{
  regular_videos: YouTubeVideo[];
  shorts: YouTubeVideo[];
}> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured, returning empty results');
    return { regular_videos: [], shorts: [] };
  }

  try {
    // Enhanced search queries for better LTK content discovery
    const queries = [
      '#LTK League The k4sen',
      'LTK League of Legends k4sen',
      'League The k4sen ハイライト',
      'LTK 切り抜き',
      'k4sen LTK クリップ',
      'LTK ストリーマー大会',
      'League The k4sen 面白シーン'
    ];

    const allVideos: YouTubeVideo[] = [];
    const seenVideoIds = new Set<string>();
    const resultsPerQuery = Math.ceil(maxResults / queries.length);

    console.log(`Searching for LTK videos with ${queries.length} queries, ${resultsPerQuery} results each`);

    // Search with each query to get diverse results
    for (const [index, query] of queries.entries()) {
      try {
        console.log(`Searching query ${index + 1}/${queries.length}: "${query}"`);
        
        const searchResults = await searchYouTubeVideos(query, Math.min(resultsPerQuery, MAX_RESULTS_PER_REQUEST));
        
        // Get video IDs for detailed information
        const videoIds = searchResults.items
          .map(item => item.id.videoId)
          .filter(id => id && !seenVideoIds.has(id)); // Avoid duplicates and null IDs

        console.log(`Found ${videoIds.length} new videos for query "${query}"`);

        if (videoIds.length === 0) continue;

        // Mark as seen
        videoIds.forEach(id => seenVideoIds.add(id));

        // Get detailed video information in batches (YouTube API allows up to 50 IDs per request)
        const batchSize = 50;
        for (let i = 0; i < videoIds.length; i += batchSize) {
          const batch = videoIds.slice(i, i + batchSize);
          
          try {
            const videoDetails = await getVideoDetails(batch);
            
            // Process each video
            for (const video of videoDetails) {
              const duration = formatDuration(video.contentDetails.duration);
              const isShort = isYouTubeShort(
                video.contentDetails.duration, 
                video.snippet.title, 
                video.snippet.description
              );

              const processedVideo: YouTubeVideo = {
                id: video.id,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails.high?.url || 
                          video.snippet.thumbnails.medium?.url || 
                          video.snippet.thumbnails.default.url,
                duration,
                publishedAt: video.snippet.publishedAt,
                channelId: video.snippet.channelId,
                channelName: video.snippet.channelTitle,
                viewCount: parseInt(video.statistics.viewCount) || 0,
                likeCount: video.statistics.likeCount ? parseInt(video.statistics.likeCount) : undefined,
                tags: video.snippet.tags || [],
                isShort,
                url: isShort ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`
              };

              allVideos.push(processedVideo);
            }

            // Add delay between batch requests
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
          } catch (batchError) {
            console.warn(`Error processing video batch:`, batchError);
            continue;
          }
        }

        // Add delay between different query requests
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      } catch (error) {
        console.warn(`Error searching for query "${query}":`, error);
        continue;
      }
    }

    console.log(`Total videos found: ${allVideos.length}`);

    // Remove duplicates by ID (in case any slipped through)
    const uniqueVideos = Array.from(
      new Map(allVideos.map(video => [video.id, video])).values()
    );

    // Sort by publish date (newest first)
    uniqueVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Separate shorts and regular videos with better ratio
    const shorts = uniqueVideos.filter(video => video.isShort);
    const regular_videos = uniqueVideos.filter(video => !video.isShort);

    // Apply limits while maintaining some balance
    const maxRegular = Math.floor(maxResults * 0.7);
    const maxShorts = Math.floor(maxResults * 0.3);

    const finalRegular = regular_videos.slice(0, maxRegular);
    const finalShorts = shorts.slice(0, maxShorts);

    console.log(`Returning ${finalRegular.length} regular videos and ${finalShorts.length} shorts`);

    return {
      regular_videos: finalRegular,
      shorts: finalShorts
    };
  } catch (error) {
    console.error('Error searching LTK videos:', error);
    
    // Return empty results instead of throwing to prevent API routes from failing
    return {
      regular_videos: [],
      shorts: []
    };
  }
}

/**
 * Generate static video data file for build-time optimization
 * @param outputPath Path to save the JSON file
 */
export async function generateStaticVideoData(outputPath: string): Promise<void> {
  try {
    const videoData = await searchLTKVideos(50);
    
    const staticData = {
      ...videoData,
      last_updated: new Date().toISOString(),
      total_count: videoData.regular_videos.length + videoData.shorts.length
    };

    // In a real implementation, you would write to file system
    // For now, we'll just return the data structure
    console.log('Generated static video data:', {
      regular_videos: staticData.regular_videos.length,
      shorts: staticData.shorts.length,
      total: staticData.total_count,
      last_updated: staticData.last_updated
    });

    return staticData as any; // Type assertion for demo purposes
  } catch (error) {
    console.error('Error generating static video data:', error);
    throw error;
  }
}

/**
 * Validate YouTube video URL and extract video ID
 * @param url YouTube video URL
 * @returns Video ID or null if invalid
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Check if a video is still available (not deleted or private)
 * @param videoId YouTube video ID
 * @returns Promise<boolean>
 */
export async function isVideoAvailable(videoId: string): Promise<boolean> {
  try {
    const details = await getVideoDetails([videoId]);
    return details.length > 0;
  } catch (error) {
    return false;
  }
}