# Task Management System

## Prototype

THe prototype implements accounts, Application s and blocks in json files. These can very well be changed or implemented as tables or blobs. The importaant part is structure and how relations and connections are made. 

## Topic based system

All event signalling and communication between blocks is made through a messagebroker. It relies solely on *publish* and *subscribe* on blocks input and outputs. 

## Account

Every application runs under an account. The account holds information about all configured applications that account owns. 

These are defined as 

```json
{
  "topic": "AccountTopic",
  "args": {
    "argName1": "valueOfArgument",
    "argName2": "valueOfArgument2"
  },
  "applications": {
    "App1": {...},
    "App2": {...},
    }
  }
}

```

## Application

An application is a configuration of a block. 

Runs a block, as a user, with provided data to the blocks input. The output is omitted. 

An application is defined as this:

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| `name`   | String | The name of the block to run. The entrypoint for the application |
| `user`   | UID    | The unique id of the user to run the block as. Internally, all API calls used by blocks will run as this user. Access control for all request is applied with that users priveleges in the request. |
| `args`   | Object | `key`  the name of the argument. used as %name% in the blocks<br />`value` the value of the argument, all occurances of `key` will be replaced with `value`. |
| `inputs` | Object | `key` the name of the input<br />`value` object with configuration for that input<br />please see block input declaration section in this document. |
| `error`  | String | allowed values are *all*, *silent*, or an Array of topics (default: *all*) |

Example:

```json
{
      "name": "NameOfBlockToRun",
      "user": "UidOfUserToRunAs",
      "args": {
        "argName1": "valueOfArgument",
        "argName2": "valueOfArgument2"
      },
      "inputs": {
        "Input1": {
          "topics": ["YXBpX2RldmVsb3BfTWV0ZXJfNzA="]
        },
        "Input2": {
          "topics": ["YXBpX2RldmVsb3BfTWV0ZXJfNzE="]
        },
        "Input3": {
          "topics": ["YXBpX2RldmVsb3BfTWV0ZXJfNzI="]
        }
      },
      "error": "silent"
    }
```

## Block

A code block can not have sub blocks. It has code, wich executes when an input changes. the result of the code is the current value of the block. 

A code block is defined as:

| Name       | Type                | Description                                                  | Default   |
| ---------- | ------------------- | ------------------------------------------------------------ | --------- |
| `name`     | String              | The unique name of the block. It is used as reference when configuring applications and container blocks. must be unique under the account. | required  |
| `inputs`   | InputDeclaration    | `key` name of the input<br />`value` input definition        | {}        |
| `packages` | [String]            | List of packages to provide in the code block                | []        |
| `code`     | String              | The code. ES6. See code section below for description.       | undefined |
| `children` | Object              | Definition of child blocks. If children is defined, the `code` is skipped. If both `children` and `code` is defined, it is an invalid configuration. | {}        |
| `output`   | Array               | All connected outputs from child block is output from the block | undefined |
| `error`    | Array\|String\|Null | *all*, *silent* or array of error from child blocks.            | `all`     |

```json
{
  "name": "Add",
  "inputs": {
    "A": {
      "title": "Input A"
    },
    "B": {
      "title": "Input B"
    }
  },
  "packages": [],
  "code": "return A + B;"
}
```

#### Inputs

A block can have inputs. The inputs are possible to configure in a number of ways. The principle is that each input, if connected, gets its value from a topic payload. each time a message is published in a topic, all inputs which listens to that topic gets a subscription callback and update the input value according to the rules below. 

| Name          | Type     | Description                                                  | Default               |
| ------------- | -------- | ------------------------------------------------------------ | --------------------- |
| `title`       | String   | The title for the input                                      | the name of the block |
| `topics`      | [String] | Topics which callbacks trigger the input value change.       | empty array           |
| `value`       | Any      | The present value for the input. If defined in the configuration, that value is used regardless of what payload data on topic update is. | undefined             |
| `connectable` | Boolean  | Indicates if the input is possible to connect to outputs from other blocks or not. | true                  |
| `editable`    | Boolean  | Indicates if the input value is editable or should be displayed as a label. | true                  |

Each block input contains of a number of topics, mostly only one. Depending on how the configuration is made.

##### Example

```json
"inputs": {
    "Input1": {
      "topics":["topic1", "topic2"],
      "connectable":false,
      "editable":false,
      "title": "Input 1",
      "value": 1
    },
    "Input 2": {
      "title": "Input B"
    },
    "Input3": {
      "editable":true,
      "title": "Input 3",
      "value": 1
    },
  },
```

###### Input1

Defines a constant, non connectable input. it is bound to two topics. Every time an event is published to any of those topics, the block is executed and the value of the input is 1. It is not possible to connect this input to another output. It is not possible to edit the value in the block. 

###### Input2

Defines a generic input. It can be connected to any output, and the value will be the payload from the message published to the topic by the connected output. 

###### Input 3

Defines an input. It is connectable. It has a constant value regardless of topic payload values. The value is possible to edit in the block configuration. 

#### Code is defined by:

##### Code as string

If the code is a string, that string is used as the code block. The inputs exists as global variables in the block, as well as context and other variables. Packages can be used and most of operations can be done. 

```json
 "code": "return A + B;"
```

##### Code as an object

The object is a reference to a script file, located next to the block. The script file can have arguments used as globals. The value of these are used in the script file as global variables, to control program flow.

```json
  "code": {
    "file": "add.js",
    "args": { "DoCalculation": true }
  }
```

add.js:

```javascript
return (i1, i2, i3) => {
  if (DoCalculation) return i1 + i2 + i3;
  else return 0;
};
```

#### Children are defined by:

The block is treated as a container block. It has no function on it's own, code or otherwise. It only forwards the connected inputs to the sub blocks that define their inputs to be the blocks inputs. Names of children are unique within the block only, the container blocks name is still required to be unique among blocks on the same level (blocks that can draw a connection to it directly). 

| Name       | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| `children` | Object | `key` name of child block<br />`value` the child block configuration |
|            |        |                                                              |
|            |        |                                                              |



```json
{
  "name": "Add3",
  "inputs": {
    "I1": {
      "title": "Input 1"
    },
    "I2": {
      "title": "Input 2"
    },
    "I3": {
      "title": "Input 3"
    }
  },
  "children": {
    "Add2": {
      "name": "Add",
      "inputs": {
        "A": {
          "topics": ["./Add1"]
        },
        "B": {
          "topics": ["./I3"]
        }
      }
    },
    "Add1": {
      "name": "Add",
      "inputs": {
        "A": {
          "topics": ["./I1"]
        },
        "B": {
          "topics": ["./I2"]
        }
      }
    }
  },
  "output": ["./Add2"],
  "error": "all"
}
```



