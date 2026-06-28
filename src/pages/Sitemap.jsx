import { useEffect } from 'react';

export default function Sitemap() {
  useEffect(() => {
    // Redirect to actual XML file
    window.location.href = '/sitemap.xml';
  }, []);
  return null;
}