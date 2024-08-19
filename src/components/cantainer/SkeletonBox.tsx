import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';

const SkeletonBox = ({ num = 1 }: { num: number }) => {
  const arrNum = [];
  for (let index = 0; index < num; index++) {
    arrNum.push(index);
  }
  return (
    <Stack spacing={1} width="100%">
      {arrNum.map((item: number) => {
        return (
          <Box key={item} mb={1}>
            <Skeleton variant="rounded" height={30} width="50%" animation="wave" sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={50} animation="wave" />
          </Box>
        );
      })}
    </Stack>
  );
};

export default SkeletonBox;
