"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  patientName: z.string().min(2, {
    message: 'Patient name must be at least 2 characters.',
  }),
  patientNumber: z.string().regex(/^\d+$/, {
    message: 'Patient number must contain only digits.',
  }),
  caretakerName: z.string().min(2, {
    message: 'Caretaker name must be at least 2 characters.',
  }),
  caretakerNumber: z.string().regex(/^\d+$/, {
    message: 'Caretaker number must contain only digits.',
  }),
});

export function Survey() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientNumber: "",
      caretakerName: "",
      caretakerNumber: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className="w-1/2 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#14213d] text-lg">Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="..." {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#14213d] text-lg">Patient Number</FormLabel>
                <FormControl>
                  <Input placeholder="..." {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />    

          <FormField
            control={form.control}
            name="caretakerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#14213d] text-lg">Caretaker Name</FormLabel>
                <FormControl>
                  <Input placeholder="..." {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />    

          <FormField
            control={form.control}
            name="caretakerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#14213d] text-lg">Caretaker Number</FormLabel>
                <FormControl>
                  <Input placeholder="..." {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />    
          <div className="flex justify-center">
            <Button type="submit" className="mx-auto w-32 hover:bg-[#fca311] bg-[#14213d]">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
