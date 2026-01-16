import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader className={`${sizeClasses[size]} text-primary-600 animate-spin mx-auto mb-3`} />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  rounded = false,
  className = '',
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-lg' : ''} ${className}`}
      style={{
        width,
        height,
      }}
    />
  );
};

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  height = '4rem',
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={height} rounded />
      ))}
    </div>
  );
};

export default Loading;
