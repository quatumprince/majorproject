export const CONTRACT_ADDRESSES= "0x686f52E4DacbED3Bc342818c5b1224d519645F66"

export const CONTRACT_ABI= [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_studentId",
				"type": "string"
			}
		],
		"name": "acceptFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			}
		],
		"name": "addBranch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_branchHead",
				"type": "address"
			}
		],
		"name": "addBranchHead",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			}
		],
		"name": "addDepartment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_schoolHead",
				"type": "address"
			}
		],
		"name": "addSchool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_schoolHead",
				"type": "address"
			}
		],
		"name": "addSchoolHead",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_studentId",
				"type": "string"
			}
		],
		"name": "addStudent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_studentId",
				"type": "string"
			}
		],
		"name": "rejectFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_fileHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_fileSize",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_fileType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_fileName",
				"type": "string"
			}
		],
		"name": "sendFile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_fileStorageAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "branchHeads",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fileStorage",
		"outputs": [
			{
				"internalType": "contract FileStorage",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			}
		],
		"name": "getBranchStudentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			}
		],
		"name": "getDepartmentBranchCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getSchoolByIndex",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			}
		],
		"name": "getSchoolDepartmentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSchoolNames",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSchoolsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_departmentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_branchName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_studentId",
				"type": "string"
			}
		],
		"name": "getStudentFileContent",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "schoolHeads",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "schools",
		"outputs": [
			{
				"internalType": "string",
				"name": "schoolName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "departmentCount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "schoolHead",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "schoolsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]