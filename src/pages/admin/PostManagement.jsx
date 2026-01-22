import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import UniversalShimmer from "@/components/ui/UniversalShimmer";
import AxiosInstance from "@/api/axiosInstance";

export function PostManagement() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Change this to 10 or 20 as needed

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await AxiosInstance.get("/admin/getallpost");
                setPosts(response.data.posts || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserPosts();
    }, []);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(posts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <UniversalShimmer />;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Post Management</h2>
                <p className="text-muted-foreground">Monitor and manage user posts</p>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="px-6 py-4 border-b">
                    <CardTitle className="text-lg font-semibold">All Posts ({posts.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">#</th>
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">User</th>
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Caption</th>
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Media</th>
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-center">Reports</th>
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentPosts.map((post, index) => (
                                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* Correct Row Numbering: index + 1 + offset */}
                                        <td className="p-6 align-middle font-medium">
                                            {indexOfFirstItem + index + 1}
                                        </td>
                                        <td className="p-6 align-middle">
                                            <span className="font-medium">{post.user?.first_name}</span>
                                        </td>
                                        <td className="p-6 align-middle max-w-[300px] truncate" title={post.description}>
                                            {post.description}
                                        </td>
                                        <td className="p-6 align-middle">
                                            {post.media_url ? (
                                                post.media_type === "video" ? (
                                                    <video src={post.media_url} className="h-12 w-16 object-cover rounded-md border" muted />
                                                ) : (
                                                    <img src={post.media_url} className="h-12 w-16 object-cover rounded-md border" alt="Post" />
                                                )
                                            ) : (
                                                <span className="text-xs text-slate-400">None</span>
                                            )}
                                        </td>
                                        <td className="p-6 align-middle text-center">
                                            {post.reported_count > 0 ? (
                                                <Badge variant="destructive">{post.reported_count}</Badge>
                                            ) : (
                                                <span className="text-slate-400">0</span>
                                            )}
                                        </td>
                                        <td className="p-6 align-middle text-muted-foreground">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 align-middle">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Pagination UI Controls --- */}
                    <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
                        <div className="text-sm text-muted-foreground">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, posts.length)} of {posts.length} posts
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={currentPage === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        className="w-8 h-8 p-0"
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}