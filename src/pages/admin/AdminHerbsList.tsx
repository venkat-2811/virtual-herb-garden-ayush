
import React, { useState } from 'react';
import { useHerbs } from '@/contexts/HerbContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Upload,
  Eye
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Herb } from '@/types';

const AdminHerbsList: React.FC = () => {
  const { herbs, deleteHerb } = useHerbs();
  const [searchQuery, setSearchQuery] = useState('');
  const [herbToDelete, setHerbToDelete] = useState<Herb | null>(null);
  
  const filteredHerbs = herbs.filter(herb => 
    herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteHerb = () => {
    if (herbToDelete) {
      deleteHerb(herbToDelete.id);
      setHerbToDelete(null);
    }
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Manage Herbs</h1>
          <p className="text-gray-600">
            Add, edit, or remove herbs from the database.
          </p>
        </div>
        
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/admin/herbs/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Herb
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search herbs by name or scientific name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Herb</TableHead>
                <TableHead>Scientific Name</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>3D Model</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHerbs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchQuery ? (
                      <>No herbs found matching your search criteria.</>
                    ) : (
                      <>No herbs in the database. Click "Add New Herb" to add one.</>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredHerbs.map((herb) => (
                  <TableRow key={herb.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          {herb.images.length > 0 ? (
                            <img 
                              src={herb.images[0].url} 
                              alt={herb.name}
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full bg-herb-primary/20" />
                          )}
                        </div>
                        <span className="font-medium">{herb.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="italic">{herb.scientificName}</TableCell>
                    <TableCell>
                      {herb.region.slice(0, 2).join(", ")}
                      {herb.region.length > 2 && ", ..."}
                    </TableCell>
                    <TableCell>
                      {herb.uses.slice(0, 2).join(", ")}
                      {herb.uses.length > 2 && ", ..."}
                    </TableCell>
                    <TableCell>
                      {herb.model3dUrl ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                          Not Available
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/herbs/${herb.id}`} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/herbs/${herb.id}/edit`} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/herbs/${herb.id}/upload`} className="cursor-pointer">
                              <Upload className="mr-2 h-4 w-4" />
                              <span>Upload 3D Model</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setHerbToDelete(herb)}
                            className="text-red-600 cursor-pointer"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <AlertDialog open={!!herbToDelete} onOpenChange={() => setHerbToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the herb 
              "{herbToDelete?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteHerb}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminHerbsList;
