import { Skeleton } from '@mui/material';

type CustomSkeletonProps = {
  width?: number;
  height?: number;
};

const CustomSkeleton = ({ width = 900, height = 400 }: CustomSkeletonProps) => {
  return (
    <Skeleton
      className="bg-gray-200 bg-opacity-50"
      variant="rounded"
      width={width}
      height={height}
    />
  );
};

export default CustomSkeleton;
