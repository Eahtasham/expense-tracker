"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setOnlineStatus, syncPendingChanges } from "@/lib/redux/slices/syncSlice"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Loader2, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export function SyncStatus() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { isOnline, isSyncing, pendingChanges } = useSelector((state: RootState) => state.sync)

  // Toggle online status
  const toggleOnlineStatus = () => {
    const newStatus = !isOnline
    dispatch(setOnlineStatus(newStatus))

    if (newStatus && pendingChanges.length > 0) {
      toast({
        title: "Connection restored",
        description: "Syncing pending changes...",
      })
      dispatch(syncPendingChanges())
    }
  }

  // Simulate auto-sync when going online
  useEffect(() => {
    if (isOnline && pendingChanges.length > 0) {
      dispatch(syncPendingChanges())
    }
  }, [isOnline, pendingChanges.length, dispatch])

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      {isSyncing ? (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1 px-2 py-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Syncing...
        </Badge>
      ) : isOnline ? (
        <Badge variant="outline" className="bg-green-100 text-green-800 px-2 py-1">
          {pendingChanges.length > 0 ? `${pendingChanges.length} changes pending` : "All changes synced"}
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1 px-2 py-1">
          <WifiOff className="h-3 w-3" />
          Offline
        </Badge>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleOnlineStatus}
        className="h-8 text-xs w-full sm:w-auto"
      >
        {isOnline ? "Go Offline" : "Go Online"}
      </Button>
    </div>

  )
}

