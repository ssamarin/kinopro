import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ProfessionalCard, { Professional as ProfessionalCardType } from './ProfessionalCard';

interface ProfessionalsListProps {
  allProfessionals: ProfessionalCardType[];
}

const PAGE_SIZE = 20;

const ProfessionalsList: React.FC<ProfessionalsListProps> = ({ allProfessionals }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE); // сбрасываем при смене фильтра
  }, [allProfessionals]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < allProfessionals.length && !loading) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allProfessionals.length));
          setLoading(false);
        }, 500); // имитация загрузки
      }
    }, { threshold: 1 });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, allProfessionals.length, loading]);

  const professionals = allProfessionals.slice(0, visibleCount);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Найдено специалистов: {allProfessionals.length}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        justifyContent: allProfessionals.length === 1 ? 'center' : 'flex-start',
      }}>
        {professionals.map((professional) => (
          <Box key={professional.id} sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px', maxWidth: allProfessionals.length === 1 ? 500 : 'none', display: 'flex', justifyContent: 'center' }}>
            <ProfessionalCard professional={professional} />
          </Box>
        ))}
      </Box>
      <Box ref={loaderRef} sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        {loading && <CircularProgress color="primary" />}
      </Box>
    </Box>
  );
};

export default ProfessionalsList; 