const VideoSkeleton = () => {
  return (
    <div className="aspect-video w-full overflow-hidden mb-4 animate-pulse bg-gray-200 relative p-6 rounded-2xl shadow-md border border-gray-200">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default VideoSkeleton;
