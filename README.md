Cinema ticketing using apollo express server.



Concurrent usage is not safe

Each worker process hosts its own Apollo Server instance, and the inbuilt cluster module does round robin load balancing.