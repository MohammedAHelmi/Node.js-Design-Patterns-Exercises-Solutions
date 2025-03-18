The idea of a nested cancellable promise is that:

1. A generator function is wrapped by another function that returns a cancellable promise 

2. The generator function yields every promise allowing the wrapper function to control it

3. If the wrapped function is done, then resolve else continue

4. The Wrapper ensures that isCancelled control variable is not set (which is manipulated by cancel function called by the client) or it throws a cancellation error

5. If the current value of the generator object (of the wrapped function) is a cancellable promise, then the promise's cancel function is stored (so that we can call it if the client decides to cancel the main operation resulting in recursive cancellation)

6. Wait until the value of the generator value resolves (during that time the stack is available for the client to actually do the cancellation)

7. If an error results from waiting on the value throw it back to the generator function if another error is thrown, then the wrapper will throw it (reject the cancellable promise), else go to step 3