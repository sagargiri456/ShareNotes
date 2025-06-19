// components/PdfPreviewSlider.tsx
'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import Slider from "react-slick";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  fileUrl: string;
}

export default function PdfPreviewSlider({ fileUrl }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="mt-3 border rounded overflow-hidden bg-white p-2">
      {loading && <p className="text-sm text-gray-500">Loading preview...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setLoading(false);
        }}
        onLoadError={(err) => {
          setError("Failed to load PDF.");
          setLoading(false);
        }}
      >
        {!error && (
          <Slider {...settings}>
            {[1, 2, 3].map((page) =>
              page <= numPages ? (
                <div key={page}>
                  <Page pageNumber={page} width={250} renderAnnotationLayer={false} renderTextLayer={false} />
                </div>
              ) : null
            )}
          </Slider>
        )}
      </Document>
    </div>
  );
}
