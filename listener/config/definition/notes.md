### Parser
Always subscribe to the input and walk the chain backwards

Relational topics within the same block are prefixed:
`./`


The result of a block is published to it's topic, except errors.
Errors are published to the topic but suffixed `/error`

