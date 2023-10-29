"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Card} from "@/components/ui/card";

const formSchema = z.object({
  patientName: z.string().min(2, {
    message: 'Patient name must be at least 2 characters.',
  }),
  patientNumber: z.string().regex(/^\d+$/, {
    message: 'Patient number must contain only digits.',
  }),
  careTakerName: z.string().min(2, {
    message: 'Caretaker name must be at least 2 characters.',
  }),
  careTakerNumber: z.string().regex(/^\d+$/, {
    message: 'Caretaker number must contain only digits.',
  }),
  careTakerEmail: z.string().email({

  })
});

export function Survey({email}: {email: string}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientNumber: "",
      careTakerName: "",
      careTakerNumber: "",
        careTakerEmail: "",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
      axios.post('api/registration', values)
    .then((response) => {
        localStorage.removeItem('patientId')
        localStorage.removeItem('careTakerId')
        localStorage.setItem('patientId', response.data.patient.id);
        localStorage.setItem('careTakerId', response.data.careTaker.id);
        console.log(localStorage.getItem('patientId'));
        console.log(localStorage.getItem('careTakerId'));
      console.log('Form submitted successfully', response.data);
    })
    .catch((error) => {
      console.error('Form submission failed', error);
    });

    console.log(values)
  }

  return (
    <Card className="w-1/2 mx-auto  p-8 rounded-lg mb-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">Patient Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">Patient Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />    

          <FormField
            control={form.control}
            name="careTakerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">Care Taker Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />    

          <FormField
            control={form.control}
            name="careTakerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">Care Taker Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
                control={form.control}
                name="careTakerEmail"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-md">Caretaker Email</FormLabel>
                        <FormControl>
                            <Input  {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex justify-center">
            <Button type="submit" className="mx-auto w-32 text-[#14213d] hover:bg-[#14213d] hover:text-[#e5e5e5] bg-[#e5e5e5]">Submit</Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
