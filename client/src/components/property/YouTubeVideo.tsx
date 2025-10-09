import { Play } from 'lucide-react';

interface YouTubeVideoProps {
  videoUrl?: string;
  title: string;
}

export default function YouTubeVideo({ videoUrl, title }: YouTubeVideoProps) {
  if (!videoUrl) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="card p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Play className="w-5 h-5 mr-2 text-primary-600" />
        Property Video Tour
      </h3>
      
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={`${title} - Video Tour`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}