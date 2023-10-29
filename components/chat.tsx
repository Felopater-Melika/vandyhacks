import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Card} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";

type FormData = {
    chatInput: string;
};





function Chat() {
    const [isSending, setIsSending] = useState(false);
    const [isChatStarted, setIsChatStarted] = useState(false);

    function startChat(patientId: string) {
        setIsChatStarted(true);
    }

    function onSubmit(data: FormData) {
        setIsSending(true);
        const chatMsg = data.chatInput;
        form.reset({chatInput: ""});
    }

    const form = useForm<FormData>();

    return (
        <div className="h-[94vh] flex flex-col">
            <ScrollArea className="h-full w-full rounded-md border p-4 mb-2 text-left space-y-4">
                {/*{transcript.map((line: any, id:any) =>*/}
                {/*    <Card className={`p-4 m-2 w-fit ${id % 2 === 0 ? 'mr-auto' : 'ml-auto'}`} key={idx}>{line}</Card>)}*/}
            </ScrollArea>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-row space-x-2">
                        <FormField
                            control={form.control}
                            name="chatInput"
                            render={({field}) => (
                                <FormItem className="flex-grow">
                                    <FormControl className="flex-grow">
                                        <Input placeholder="Enter your message" {...field} className="flex-grow" disabled={isSending} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSending}>Submit</Button>
                    </form>
                </Form>
        </div>
    );
}

export default Chat;
