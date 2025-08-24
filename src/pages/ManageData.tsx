import { useState, useMemo, useCallback, useEffect, useActionState, useId } from "react";
import { useUsers } from "@/hooks/useUsers"; // Import your existing hook
import { usePrograms } from "@/hooks/usePrograms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialogs/dialog";
import {
  AlertDialog, // Import AlertDialog components
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/dialogs/alert-dialog";
import { Input } from "@/components/ui/forms/input";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { UserData } from "@/types/ReportTypes"; // Ensure this type matches your data structure
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { db } from "@/lib/firebase"; // Import Firestore instance
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  writeBatch,
  limit,
  // serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner"; // Assuming you use sonner for notifications
import { ComboboxCreatable } from "@/components/ui/forms/ComboboxCreatable";
import { useFormStatus } from "react-dom";

// Define column helper
const columnHelper = createColumnHelper<UserData>();

// Helper function to generate the unique program ID
function generateProgramId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let id = 'B';
  id += letters.charAt(Math.floor(Math.random() * letters.length));
  id += letters.charAt(Math.floor(Math.random() * letters.length));
  id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return id;
}

type SaveActionResult = {
  message: string | null;
  type: 'success' | 'error' | null;
  timestamp?: number; // Add timestamp to ensure state changes trigger useEffect
};

type NewUserFormState = Omit<UserData, 'id'>;

// Define the initial state for useFormState
const initialSaveState: SaveActionResult = { message: null, type: null };

async function saveUserAction(
  previousState: SaveActionResult,
  formData: {
    newUser: NewUserFormState;
    editingUser: UserData | null;
  }
): Promise<SaveActionResult> {
  const { newUser, editingUser } = formData;

  if (!editingUser) {
    console.error("Save action called without an editing user context.");
    return { message: "Cannot save: No user selected for editing.", type: 'error', timestamp: Date.now() };
  }

  // Basic validation
  if (!newUser.name || !newUser.position) {
    return { message: "Name and Position (Jawatan) are required.", type: 'error', timestamp: Date.now() };
  }

  let programId = '';
  if (newUser.programName && newUser.programName.trim() !== "") {
    const programsCollectionRef = collection(db, "programs");
    const programQuery = query(
      programsCollectionRef,
      where("programName", "==", newUser.programName.trim()),
      limit(1)
    );

    try {
      const programSnapshot = await getDocs(programQuery);
      if (!programSnapshot.empty) {
        // Found existing program, use its ID
        programId = programSnapshot.docs[0].id;
      } else {
        // No existing program found, generate a new ID
        programId = generateProgramId();
        console.log(`Generated new programId: ${programId} for programName: ${newUser.programName}`);
        // Optional: You might want to add this new program to the 'programs' collection here
        // await addDoc(programsCollectionRef, { programName: newUser.programName, programId: programId /* other fields? */ });
      }
    } catch (err) {
      console.error("Error checking for existing program:", err);
      // Decide how to handle this error - proceed without programId or return an error state?
      // For now, let's return an error state.
      return { message: "Error checking for program existence. Please try again.", type: 'error', timestamp: Date.now() };
    }
  } else {
    // Handle case where programName is empty or whitespace - maybe generate ID or leave empty?
    // For now, we'll leave programId as an empty string if programName is not provided.
    console.log("No programName provided, programId will be empty.");
  }

  // Prepare data for Firestore
  const userDataToSave = {
    name: newUser.name,
    jawatan: newUser.position,
    institution: newUser.institution,
    fakulti: newUser.faculty,
    programName: newUser.programName || "",
    completed_at: null,
    programId: programId,
    userId: "",
    // updatedAt: serverTimestamp(), // Optional
  };

  try {
    // --- Update existing user ---
    const userDocRef = doc(db, "users", editingUser.id);
    const batch = writeBatch(db);
    batch.update(userDocRef, userDataToSave);

    const programNameChanged = newUser.programName !== editingUser.programName;
    if (programNameChanged) {
      // Update related results (logic remains the same)
      const resultsCollectionRef = collection(db, "results");
      const resultsQuery = query(resultsCollectionRef, where("userId", "==", editingUser.id));
      const resultsSnapshot = await getDocs(resultsQuery);
      resultsSnapshot.forEach((resultDoc) => {
        batch.update(resultDoc.ref, { programName: userDataToSave.programName, programId: userDataToSave.programId });
      });

      // Update program name in programs collection (if old name existed) (logic remains the same)
      if (editingUser.programName) {
        const programsCollectionRef = collection(db, "programs");
        const programQuery = query(
          programsCollectionRef,
          where("programName", "==", editingUser.programName),
          limit(1)
        );
        const programSnapshot = await getDocs(programQuery);
        if (!programSnapshot.empty) {
          console.log(`Program name changed for user ${editingUser.id}, associated results updated.`);
        } else {
          console.warn(`Could not find program "${editingUser.programName}" to potentially update.`);
        }
      }
    }

    await batch.commit();
    return { message: `User "${newUser.name}" updated successfully.${programNameChanged ? ' Related results also updated.' : ''}`, type: 'success', timestamp: Date.now() };
  } catch (err) {
    console.error("Error saving user:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    let displayMessage = `Failed to save user. ${errorMessage}`;
    if (errorMessage.includes('permission-denied') || errorMessage.includes('PERMISSION_DENIED')) {
      displayMessage = `Permission denied. You might not have the rights to ${editingUser ? 'update' : 'add'} this data.`;
    }
    return { message: displayMessage, type: 'error', timestamp: Date.now() };
  }
}

export const ManageData = () => {
  const { data: users = [], isLoading, isError, error } = useUsers();
  const { data: programs = [], isLoading: programsLoading, error: programsFetchError } = usePrograms();

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  // Initialize newUser state based on NewUserFormState (all fields except id)
  const [newUser, setNewUser] = useState<NewUserFormState>({ name: "", position: "", institution: "", faculty: "", programName: "" });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // initial page index
    pageSize: 10, // initial page size
  });

  // const [isSaving, setIsSaving] = useState(false); // State for save button loading
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  const [saveState, submitSaveAction] = useActionState(saveUserAction, initialSaveState);

  function SubmitButton() {
    const { pending } = useFormStatus(); // Get pending state from parent form action

    return (
      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Perubahan"
        )}
      </Button>
    );
  }

  const institutionOptions = useMemo(() => {
    const uniqueInstitutions = [...new Set(users.map(u => u.institution).filter(Boolean))]; // Filter out empty/null
    return uniqueInstitutions.map(inst => ({ value: inst, label: inst }));
  }, [users]);

  const facultyOptions = useMemo(() => {
    const uniqueFaculties = [...new Set(users.map(u => u.faculty).filter(Boolean))];
    return uniqueFaculties.map(fac => ({ value: fac, label: fac }));
  }, [users]);

  const programOptions = useMemo(() => {
    // Ensure programName exists and is not empty
    const validPrograms = programs.filter(p => p.programName && p.programName.trim() !== "");
    // Use programName for both value and label for simplicity here,
    // but using programId as value would be more robust if available everywhere.
    return validPrograms.map(prog => ({ value: prog.programName, label: prog.programName }));
  }, [programs]);

  // --- Modal Handlers ---
  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingUser(null);
    // Reset newUser state to initial empty values
    setNewUser({ name: "", position: "", institution: "", faculty: "", programName: "" });
  }, []); // No dependencies needed

  const handleOpen = useCallback((user: UserData | null = null) => {
    if (!user) {
      console.error("handleOpen called without a user. This should not happen.");
      toast.error("Cannot open edit dialog: No user specified.");
      return;
    }
    setEditingUser(user);
    // Map UserData to form state (NewUserFormState)
    setNewUser(
      user
        ? { name: user.name, position: user.position, institution: user.institution, faculty: user.faculty, programName: user.programName }
        : { name: "", position: "", institution: "", faculty: "", programName: "" } // Reset with all fields
    );
    setOpen(true);
  }, []); // No dependencies needed if it only uses setters

  useEffect(() => {
    // Check for message and type to avoid reacting to initial state
    if (saveState.message && saveState.type) {
      if (saveState.type === 'success') {
        toast.success(saveState.message);
        handleClose(); // Close dialog on success
      } else if (saveState.type === 'error') {
        toast.error(saveState.message);
      }
    }
  }, [saveState, handleClose]);

  const handleDeleteInitiate = useCallback((user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }, []);

  // Performs the actual deletion after confirmation
  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;

    const userId = userToDelete.id;
    const userName = userToDelete.name || 'this user';

    // Close dialog first
    setDeleteDialogOpen(false);
    setUserToDelete(null);

    // Show loading toast
    const deleteToast = toast.loading(`Deleting user "${userName}" and associated data...`);

    const userDocRef = doc(db, "users", userId);
    const resultsCollectionRef = collection(db, "results");
    const resultsQuery = query(resultsCollectionRef, where("userId", "==", userId));

    try {
      const batch = writeBatch(db);
      batch.delete(userDocRef);

      const resultsSnapshot = await getDocs(resultsQuery);
      let deletedResultsCount = 0;
      resultsSnapshot.forEach((resultDoc) => {
        batch.delete(resultDoc.ref);
        deletedResultsCount++;
      });

      await batch.commit();

      toast.success(`User "${userName}" and ${deletedResultsCount} associated result(s) deleted successfully.`, {
        id: deleteToast // Update the loading toast
      });

    } catch (err) {
      console.error("Error deleting user and associated data:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      let toastMessage = `Failed to delete user "${userName}". ${errorMessage}`;
      if (errorMessage.includes('permission-denied') || errorMessage.includes('PERMISSION_DENIED')) {
        toastMessage = `Permission denied. You might not have the rights to delete this user or their results.`;
      }
      toast.error(toastMessage, {
        id: deleteToast // Update the loading toast
      });
    }
  }, [userToDelete]);

  // Define columns for the table
  const columns = useMemo<ColumnDef<UserData, any>[]>(() => [
    columnHelper.accessor("name", {
      header: "Nama",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("position", { // Corresponds to 'jawatan' in Firestore
      header: "Jawatan",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("institution", {
      header: "Institusi",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("faculty", { // Corresponds to 'fakulti' in Firestore
      header: "Fakulti",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("programName", {
      header: "Nama Program",
      cell: info => info.getValue() || '-', // Display dash if no program name
    }),
    columnHelper.display({
      id: "actions",
      header: "Tindakan",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleOpen(row.original)}>
            <Edit size={16} />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteInitiate(row.original)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    }),
  ], [handleOpen, handleDeleteInitiate]); // Add dependencies

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination model
  });

  const pageSizeId = useId(); // Unique ID for the page size select element

  // --- Render Logic ---
  if (isLoading || programsLoading) {
    return <div className="container mx-auto p-6 text-center">Loading user data...</div>;
  }

  if (isError || programsFetchError) {
    return <div className="container mx-auto p-6 text-red-600 text-center">Error loading user data: {error?.message}</div>;
  }


  return (
    <div className="mx-auto p-6 max-w-full min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Urus Data</h2>
      <p className="text-sm text-muted-foreground mb-4">Urus Data Induk</p>

      {/* TanStack Table */}
      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-gray-300 bg-blue-300 uppercase tracking-wider cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                    title={header.column.getCanSort() ? 'Sort column' : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '🔼',
                        desc: '🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Tiada data pengguna ditemui.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Muka{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} daripada {table.getPageCount() > 0 ? table.getPageCount() : 1}
          </strong>
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Baris setiap muka:</span>
          <select
            id={pageSizeId + `-select`}
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className="border p-1 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}> {/* Ensure close on overlay click */}
        <DialogContent className="sm:max-w-[625px]"> {/* Increased width slightly */}
          <form action={() => submitSaveAction({ newUser, editingUser })}>
            <DialogHeader>
              <DialogTitle>Sunting Maklumat Pengguna</DialogTitle>
              <DialogDescription>
                Kemaskini maklumat pengguna di bawah.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Form fields remain the same */}
              <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                <label htmlFor="name" className="sm:text-right sm:col-span-1">Nama</label>
                <div className="sm:col-span-3">
                  <Input
                    id="name"
                    placeholder="Nama Penuh"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                <label htmlFor="position" className="sm:text-right sm:col-span-1">Jawatan</label>
                <div className="sm:col-span-3">
                  <Input
                    id="position"
                    placeholder="Jawatan"
                    value={newUser.position}
                    onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                <label htmlFor="institution" className="sm:text-right sm:col-span-1">Institusi</label>
                <div className="sm:col-span-3">
                  <ComboboxCreatable
                    options={institutionOptions}
                    value={newUser.institution}
                    onChange={(value) => setNewUser({ ...newUser, institution: value })}
                    placeholder="Pilih atau taip institusi..."
                    searchPlaceholder="Cari atau tambah institusi..."
                    notFoundMessage="Tiada institusi ditemui."
                    createLabel="Tambah institusi baru"
                    itemTypeLabel="institusi"
                    className="w-full"
                  />
                </div>
                {/* Hidden input if needed for form data */}
                <input type="hidden" name="institution" value={newUser.institution} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                <label htmlFor="faculty" className="sm:text-right sm:col-span-1">Fakulti</label>
                <div className="sm:col-span-3">
                  <ComboboxCreatable
                    options={facultyOptions}
                    value={newUser.faculty}
                    onChange={(value) => setNewUser({ ...newUser, faculty: value })}
                    placeholder="Pilih atau taip fakulti..."
                    searchPlaceholder="Cari atau tambah fakulti..."
                    notFoundMessage="Tiada fakulti ditemui."
                    createLabel="Tambah fakulti baru"
                    itemTypeLabel="fakulti"
                    className="w-full"
                  />
                </div>
                <input type="hidden" name="faculty" value={newUser.faculty} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                <label htmlFor="programName" className="sm:text-right sm:col-span-1">Nama Program</label>
                <div className="sm:col-span-3">
                  <ComboboxCreatable
                    options={programOptions}
                    value={newUser.programName || ''}
                    onChange={(value) => setNewUser({ ...newUser, programName: value })}
                    placeholder="Pilih atau taip program..."
                    searchPlaceholder="Cari atau tambah program..."
                    notFoundMessage="Tiada program ditemui."
                    createLabel="Tambah program baru"
                    itemTypeLabel="program"
                    className="w-full"
                  />
                </div>
                <input type="hidden" name="programName" value={newUser.programName || ''} />
              </div>
            </div>
            {/* Use DialogFooter for actions */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adakah anda pasti?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak boleh dibuat asal. Ini akan memadamkan pengguna secara kekal
              "{userToDelete?.name}" dan semua data keputusan yang berkaitan daripadanya
              pelayan kami.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Teruskan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};