"use client"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"

// Available widget types
const widgetTypes = [
  { label: "Agent Health", value: "agent-health" },
  { label: "Resource Utilization", value: "resource-utilization" },
  { label: "Alert Feed", value: "alert-feed" },
  { label: "Mission Status", value: "mission-status" },
]

interface AddWidgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddWidget: (widget: {
    type: string
    title: string
    size: "1x1" | "1x2" | "2x1" | "2x2"
  }) => void
}

export function AddWidgetDialog({ open, onOpenChange, onAddWidget }: AddWidgetDialogProps) {
  const form = useForm({
    defaultValues: {
      type: "",
      title: "",
      size: "1x1" as "1x1" | "1x2" | "2x1" | "2x2",
    },
  })

  const onSubmit = (data: any) => {
    onAddWidget(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>Add a new widget to your control panel.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Widget type is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Widget Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? widgetTypes.find((type) => type.value === field.value)?.label
                            : "Select widget type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search widget types..." />
                        <CommandList>
                          <CommandEmpty>No widget type found.</CommandEmpty>
                          <CommandGroup>
                            {widgetTypes.map((type) => (
                              <CommandItem
                                key={type.value}
                                value={type.value}
                                onSelect={() => {
                                  form.setValue("type", type.value)

                                  // Set default title based on type
                                  const defaultTitle = widgetTypes.find((t) => t.value === type.value)?.label

                                  if (defaultTitle) {
                                    form.setValue("title", defaultTitle)
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    type.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {type.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Widget title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter widget title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select widget size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1x1">Small (1x1)</SelectItem>
                      <SelectItem value="1x2">Tall (1x2)</SelectItem>
                      <SelectItem value="2x1">Wide (2x1)</SelectItem>
                      <SelectItem value="2x2">Large (2x2)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the size of your widget on the grid.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Widget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
