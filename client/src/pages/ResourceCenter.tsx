import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  FileText, 
  Video, 
  FileSpreadsheet, 
  Book, 
  Download, 
  ExternalLink, 
  Search, 
  Filter
} from "lucide-react";

// Mapping of resource types to icons
const resourceTypeIcons = {
  pdf: <FileText className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  worksheet: <FileSpreadsheet className="h-5 w-5" />,
  guide: <Book className="h-5 w-5" />,
};

// Mapping of categories to colors
const categoryColors = {
  "financial-literacy": "bg-green-100 text-green-800",
  "communication": "bg-purple-100 text-purple-800",
  "projects": "bg-blue-100 text-blue-800",
  "tech-skills": "bg-indigo-100 text-indigo-800",
  "teacher-guides": "bg-amber-100 text-amber-800",
  "parent-guides": "bg-teal-100 text-teal-800",
};

// Audience friendly display names
const audienceLabels = {
  student: "Students",
  teacher: "Teachers",
  parent: "Parents",
};

const ResourceCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch all resources
  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  // Fetch featured resources
  const { data: featuredResources } = useQuery<Resource[]>({
    queryKey: ["/api/resources/featured"],
  });

  // Filter resources based on active tab, search query, and filters
  const filteredResources = resources?.filter((resource) => {
    // Tab filter
    if (activeTab !== "all" && resource.audience && !resource.audience.includes(activeTab)) {
      return false;
    }

    // Search query filter
    if (
      searchQuery &&
      !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (filterCategory && resource.category !== filterCategory) {
      return false;
    }

    // Type filter
    if (filterType && resource.resourceType !== filterType) {
      return false;
    }

    return true;
  });

  // Calculate pagination
  const totalPages = filteredResources
    ? Math.ceil(filteredResources.length / itemsPerPage)
    : 0;
  const paginatedResources = filteredResources?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle resource action (download or external link)
  const handleResourceAction = async (resource: Resource) => {
    if (resource.fileUrl) {
      // Call the download count increment API
      try {
        await fetch(`/api/resources/${resource.id}/download`, {
          method: "POST",
        });
        // Open the file URL in a new tab
        window.open(resource.fileUrl, "_blank");
      } catch (error) {
        console.error("Failed to track download:", error);
      }
    } else if (resource.embedUrl) {
      // Just open the embed URL in a new tab
      window.open(resource.embedUrl, "_blank");
    }
  };

  // Get unique categories for filter
  const categories = resources
    ? Array.from(new Set(resources.map((r) => r.category)))
    : [];

  // Get unique resource types for filter
  const resourceTypes = resources
    ? Array.from(new Set(resources.map((r) => r.resourceType)))
    : [];

  const renderResourceTypeIcon = (type: string) => {
    return resourceTypeIcons[type as keyof typeof resourceTypeIcons] || <FileText className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Resource Center</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Resource Center</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          Failed to load resources. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
          Resource Center
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access educational materials, worksheets, guides, and videos to support your learning journey. 
          Resources for students, teachers, and parents to help bridge classroom learning with real-world skills.
        </p>
      </div>

      {/* Featured Resources Carousel (only on "all" tab) */}
      {activeTab === "all" && featuredResources && featuredResources.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredResources.slice(0, 3).map((resource) => (
              <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${resource.thumbnailUrl || '/images/default-resource.jpg'})` 
                  }}
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <div className="mt-1">{renderResourceTypeIcon(resource.resourceType)}</div>
                  </div>
                  <Badge className={getCategoryColor(resource.category)}>
                    {resource.category.replace("-", " ")}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleResourceAction(resource)} 
                    className="w-full"
                  >
                    {resource.fileUrl ? (
                      <>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" /> View Resource
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Resources Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="student">For Students</TabsTrigger>
            <TabsTrigger value="teacher">For Teachers</TabsTrigger>
            <TabsTrigger value="parent">For Parents</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-8"
              />
            </div>

            <div className="flex gap-2">
              <Select
                value={filterCategory}
                onValueChange={(value) => {
                  setFilterCategory(value);
                  setCurrentPage(1); // Reset to first page when filtering
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterType}
                onValueChange={(value) => {
                  setFilterType(value);
                  setCurrentPage(1); // Reset to first page when filtering
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value={activeTab} className="mt-0">
          {paginatedResources && paginatedResources.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <div>{renderResourceTypeIcon(resource.resourceType)}</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={getCategoryColor(resource.category)}>
                          {resource.category.replace("-", " ")}
                        </Badge>
                        {resource.audience?.map((audience) => (
                          <Badge key={audience} variant="outline">
                            {audienceLabels[audience as keyof typeof audienceLabels]}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleResourceAction(resource)} 
                        className="w-full"
                      >
                        {resource.fileUrl ? (
                          <>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </>
                        ) : (
                          <>
                            <ExternalLink className="mr-2 h-4 w-4" /> View Resource
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => {
                      // Show first, last, and pages around current
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={currentPage === pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        (pageNum === 2 && currentPage > 3) ||
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <div className="mx-auto flex flex-col items-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery || filterCategory || filterType
                    ? "Try adjusting your search or filters"
                    : "Resources will be added soon"}
                </p>
                {(searchQuery || filterCategory || filterType) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("");
                      setFilterType("");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceCenter;