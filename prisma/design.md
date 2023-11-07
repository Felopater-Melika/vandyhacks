# DB Design
Given that we're reworking this to be a more permanent project, we'll want to
redo some things.

We want the ability to configure multiple people under one account. In the
future, we want to have multiple ways of contacting them -- phone, sms, app.

## Event Queue
I need to lookup a good way to design a queue of calls that need to be made. Do
I do that inside a database? I assume so. I can have a queue entry with mutual
foreign keys to other stuff, so that once they're scheduled they refer to their
queue row. Then if they change we can update or remove the queue row. And when
the queue row comes up we can refer to the source to know what to do.

Oh! We could make the event queue also double as call history.

## Very simple configuration
- one patient per account
- one phone number for patient one phone number to notify
- only phone calls
- only configure
  - the number of retries
  - space between retries
  - what time to make the daily call
- queue entries count which index they are in retrying

I think we jump from that to simple configuration style.

## Simple Configuration
- each account has contact methods (e.g. phone, sms, app)
- contact configurations are a contact method and message to send
- each account can have multiple people to call.

The interface will have for each patient a call schedule.
- which days of the week to call on
- what times to call
- what to do if we can't reach you.

If we want the patient to be able to e.g. call at different times on different
days, we can have multiple call schedules. Call schedules can be disabled.

For contact failure handling, we could have a default thing for each patient,
then later you could override it at the call schedule scope, or even at the
individual call time scope. A contact procedure is a list of two types of
elements: a notification to a caregiver, and a call attempt. So contact
procedures are a list of rows of contact configurations and whether they're a
notification or call attempt.

For e.g. defining a procedure for a single call time, we'll have it basically
just indented below it.

We want to configure a way to log what has happened -- what calls failed, what
calls succeeded, etc.

## Complex configuration
This DB design is probably too complex for now.

We want to make it really simple to set up basic rules like calling every day. I
think we should also support more complex rules, like calling only on certain
weekdays, or telling it not to call someone on a certain day, or calling every
three days. We need to be able to configure how many contact attempts and what
methods to use.

We'll describe this with a set of rules describing when to contact someone. Then
we'll have a contact procedure entry that has it's own rules about how to
proceed if contact fails. Then we'll go in and simplify.

- Patient to contact rules is one to many.
- contact rule to contact procedure is one to one.
- contact procedure to contact failure handling is one to many.


### Contact configuration
A contact method -- e.g. phone, sms, app -- and a message to send on it.

### Contact Failure
On the frontend we'll have simple defaults that hide the complexities.

Examples
- Call three times at these specific times -- 3 rules. If all of those fail,
  then call me.
- Text them. If no response after 3 hours, call them. If that doesn't go
  through, message caretaker a custom message.
- After second contact failure, message me. After fourth contact failure, call
  me.

Design: a rule that has a reference to a contact configuration, a time offset
from the previous rule to trigger it at (to avoid problems with day roll over),
rule to jump to when it fails, and rule to jump to when it succeeds. (This is so
that we can treat e.g. notifying the caretaker as a normal rule.) Theoretically
in the future we could even have someone say whether they're checking on them
and have that become success or failure? No, better to keep going and just allow
people to manually dismiss stuff.


