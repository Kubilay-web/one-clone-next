"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  Key,
  Loader2,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
// import { createAPIKey, deleteAPIKey } from "@/actions/apiKeys";
// import { ApiKey } from "@prisma/client";
// import { timeAgo } from "@/lib/timeAgo";

function maskApiKey(key: string): string {
  // Show the "sk_live_" prefix and mask the rest
  const prefix = key.substring(0, 8); // "sk_live_"
  return `${prefix}${"•".repeat(10)}`;
}

// export function ApiKeyManagement({ orgKeys }: { orgKeys: ApiKey[] }) {
//   // const [apiKeys, setApiKeys] = useState<ApiKey[]>(orgKeys);

//   const [newKeyName, setNewKeyName] = useState("");
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   // const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
//   const [showKeyDialog, setShowKeyDialog] = useState(false);
//   const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isRevoking, setIsRevoking] = useState(false);

//   const handleCreateKey = async () => {
//     if (!newKeyName.trim()) return;
//     setIsCreating(true);
//     const { data, error } = await createAPIKey(newKeyName);
//     console.log(newKeyName);
//     if (error || !data) {
//       toast.error("Api Key Failed to Create", {
//         description: error,
//       });
//       setIsCreating(false);
//       return;
//     }

//     const key = data;
//     setNewKeyName("");
//     setShowCreateDialog(false);
//     setNewlyCreatedKey(key);
//     setShowKeyDialog(true);
//     setIsCreating(false);
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast.success("API key copied to clipboard", {
//       description: "The API key has been copied to your clipboard.",
//     });
//   };
//   const handleRevokeKey = async (id: string) => {
//     setIsRevoking(true);
//     const { success } = await deleteAPIKey(id);
//     if (success) {
//       setApiKeys(apiKeys.filter((key) => key.id !== id));
//       setKeyToRevoke(null);
//       toast.success("API key revoked", {
//         description: "The API key has been revoked successfully.",
//       });
//       setIsRevoking(false);
//     } else {
//       toast.error("API Failed to delete", {
//         description: "Something went wrong, Please try again",
//       });
//       setIsRevoking(false);
//     }
//   };
//   return (
//     <div className="mx-auto max-w-5xl space-y-6">
//       <Card className="border-border pb-4">
//         <CardHeader className="border-b bg-muted/50">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-primary" />
//               <div>
//                 <CardTitle className="text-xl">API Keys</CardTitle>
//                 <CardDescription>
//                   Manage your API keys for authentication
//                 </CardDescription>
//               </div>
//             </div>
//             <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
//               <DialogTrigger asChild>
//                 <Button>
//                   <Plus className="mr-2 h-4 w-4" /> Create new key
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Create a new key</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4 py-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Name</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Select a name to identify the key in the dashboard.
//                     </p>
//                     <Input
//                       id="name"
//                       value={newKeyName}
//                       onChange={(e) => setNewKeyName(e.target.value)}
//                       placeholder="Enter key name"
//                     />
//                   </div>
//                   {isCreating ? (
//                     <Button disabled className="w-full">
//                       <Loader2 className="animate-spin" />
//                       Creating Please wait...
//                     </Button>
//                   ) : (
//                     <Button
//                       className="w-full bg-primary hover:bg-primary/90"
//                       onClick={handleCreateKey}
//                       disabled={!newKeyName.trim()}
//                     >
//                       Create Key
//                     </Button>
//                   )}
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-muted/30">
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Key</TableHead>
//                 <TableHead>Created</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {apiKeys.length > 0 ? (
//                 apiKeys.map((apiKey) => (
//                   <TableRow key={apiKey.id}>
//                     <TableCell className="flex items-center gap-2 font-medium">
//                       <Key className="h-4 w-4 text-muted-foreground" />
//                       {apiKey.name}
//                     </TableCell>
//                     <TableCell className="font-mono text-sm">
//                       {maskApiKey(apiKey.key)}
//                     </TableCell>
//                     <TableCell className="text-sm text-muted-foreground">
//                       {timeAgo(apiKey.createdAt)}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => copyToClipboard(apiKey.key)}
//                           className="h-8 text-xs"
//                         >
//                           <Copy className="mr-1 h-3.5 w-3.5" />
//                           Copy
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setKeyToRevoke(apiKey.id)}
//                           className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
//                         >
//                           <Trash2 className="mr-1 h-3.5 w-3.5" />
//                           Revoke
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-32 text-center">
//                     <div className="flex flex-col items-center justify-center gap-3 py-8">
//                       <div className="rounded-full bg-muted p-3">
//                         <Key className="h-6 w-6 text-muted-foreground" />
//                       </div>
//                       <div className="space-y-1 text-center">
//                         <p className="font-medium">No API Keys Yet</p>
//                         <p className="mx-auto max-w-sm text-sm text-muted-foreground">
//                           Create your first API key to authenticate requests to
//                           our API.
//                         </p>
//                       </div>
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button className="mt-2">
//                             <Plus className="mr-2 h-4 w-4" /> Create key
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent>
//                           <DialogHeader>
//                             <DialogTitle>Create a new key</DialogTitle>
//                           </DialogHeader>
//                           <div className="space-y-4 py-4">
//                             <div className="space-y-2">
//                               <Label htmlFor="name">Name</Label>
//                               <p className="text-sm text-muted-foreground">
//                                 Select a name to identify the key in the
//                                 dashboard.
//                               </p>
//                               <Input
//                                 id="name"
//                                 value={newKeyName}
//                                 onChange={(e) => setNewKeyName(e.target.value)}
//                                 placeholder="Enter key name"
//                               />
//                             </div>
//                             {isCreating ? (
//                               <Button className="w-full" disabled>
//                                 <Loader2 className="animate-spin" />
//                                 Creating Please wait...
//                               </Button>
//                             ) : (
//                               <Button
//                                 className="w-full bg-primary hover:bg-primary/90"
//                                 onClick={handleCreateKey}
//                                 disabled={!newKeyName.trim()}
//                               >
//                                 Create Key
//                               </Button>
//                             )}
//                           </div>
//                         </DialogContent>
//                       </Dialog>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Dialog to show newly created key */}
//       <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-primary" />
//               Your API Key
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
//               <p className="text-sm font-medium">
//                 Make sure to copy your API key now. You wont be able to see it
//                 again.
//               </p>
//             </div>
//             <div className="flex items-center justify-between rounded-md bg-muted p-4">
//               <code className="break-all font-mono text-sm">
//                 {newlyCreatedKey?.key}
//               </code>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="ml-2 shrink-0"
//                 onClick={() =>
//                   newlyCreatedKey && copyToClipboard(newlyCreatedKey.key)
//                 }
//               >
//                 <Copy className="mr-1 h-4 w-4" />
//                 Copy
//               </Button>
//             </div>
//             <Button className="w-full" onClick={() => setShowKeyDialog(false)}>
//               Done
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//       {/* Revoke confirmation dialog */}
//       <Dialog
//         open={keyToRevoke !== null}
//         onOpenChange={(open) => !open && setKeyToRevoke(null)}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-destructive">
//               <Trash2 className="h-5 w-5" />
//               Revoke API Key
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-destructive">
//               <p className="text-sm font-medium">
//                 Are you sure you want to revoke this API key? This action cannot
//                 be undone.
//               </p>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Once revoked, any applications or services using this key will no
//               longer be able to authenticate.
//             </p>
//             <div className="flex justify-end gap-3 pt-2">
//               {isRevoking ? (
//                 <Button disabled>
//                   <Loader2 className="animate-spin" />
//                   Revoking Please wait...
//                 </Button>
//               ) : (
//                 <Button
//                   variant="destructive"
//                   onClick={() => keyToRevoke && handleRevokeKey(keyToRevoke)}
//                 >
//                   Revoke Key
//                 </Button>
//               )}
//               <Button variant="outline" onClick={() => setKeyToRevoke(null)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
