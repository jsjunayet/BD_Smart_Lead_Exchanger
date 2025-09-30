"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";

interface ScreenshotViewerProps {
  screenshots: string[];
  titles: string[];
  professionalName?: string;
  professionalImage?: string;
  maxPreview?: number;
  className?: string;
}

export const ScreenshotViewer = ({
  screenshots,
  titles,
  professionalName,
  professionalImage,
  maxPreview = 3,
  className,
}: ScreenshotViewerProps) => {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPreviews, setShowAllPreviews] = useState(false);

  const previewScreenshots = showAllPreviews
    ? screenshots
    : screenshots.slice(0, maxPreview);
  const hasMore = screenshots.length > maxPreview;

  const openFullscreen = (index: number) => {
    setCurrentImageIndex(index);
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  const getScreenshotTitle = (index: number) => {
    return titles[index] || `Screenshot ${index + 1}`;
  };

  if (screenshots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No screenshots available
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Professional Info */}
      {professionalName && (
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={professionalImage} />
            <AvatarFallback>
              {professionalName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Submitted by</p>
            <p className="text-sm text-muted-foreground">{professionalName}</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {screenshots.length} Screenshots
          </Badge>
        </div>
      )}

      {/* Screenshot Grid */}
      <div
        className={`grid gap-4 ${
          previewScreenshots.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {previewScreenshots.map((screenshot, index) => (
          <div
            key={index}
            className="group relative border rounded-lg overflow-hidden bg-background hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => openFullscreen(index)}
          >
            <div className="aspect-video relative">
              <img
                src={screenshot}
                alt={getScreenshotTitle(index)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>

            {/* Screenshot Title */}
            <div className="p-3">
              <h4 className="font-medium text-sm truncate">
                {getScreenshotTitle(index)}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view fullscreen
              </p>
            </div>
          </div>
        ))}

        {/* Show More Button */}
        {hasMore && !showAllPreviews && (
          <div
            className="group relative border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden bg-background hover:bg-muted/50 transition-colors duration-200 cursor-pointer min-h-[200px] flex items-center justify-center"
            onClick={() => setShowAllPreviews(true)}
          >
            <div className="text-center">
              <MoreHorizontal className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium text-sm">See More</p>
              <p className="text-xs text-muted-foreground">
                +{screenshots.length - maxPreview} screenshots
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Show Less Button */}
      {showAllPreviews && hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllPreviews(false)}
            className="mt-4"
          >
            Show Less
          </Button>
        </div>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black/95">
          <DialogHeader className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center justify-between text-white">
              <DialogTitle className="text-lg font-medium">
                {getScreenshotTitle(currentImageIndex)}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20"
                >
                  {currentImageIndex + 1} of {screenshots.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Navigation Buttons */}
            {screenshots.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={screenshots[currentImageIndex]}
                alt={getScreenshotTitle(currentImageIndex)}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Bottom Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  {getScreenshotTitle(currentImageIndex)}
                </h3>
                {professionalName && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={professionalImage} />
                      <AvatarFallback className="text-xs">
                        {professionalName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm opacity-80">
                      by {professionalName}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {screenshots.length > 1 && (
                <div className="flex space-x-2 max-w-md overflow-x-auto">
                  {screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 transition-all",
                        currentImageIndex === index
                          ? "border-white"
                          : "border-white/30 hover:border-white/60"
                      )}
                    >
                      <img
                        src={screenshot}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
