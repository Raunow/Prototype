### Parser
Always subscribe to the input and walk the chain backwards

Relational topics within the same block are prefixed:
`./`


The result of a block is published to it's topic, except errors.
Errors are published to the topic but suffixed `/error`


Inputs are the connected blocks that trigger the current block, this is only true in the block.json
Otherwise it describes the name and default value of the input.