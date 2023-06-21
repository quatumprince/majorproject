import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table } from 'semantic-ui-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Web3 from 'web3';
import { CONTRACT_ADDRESSES, CONTRACT_ABI } from './contract';
import './App.css';
import { create } from 'ipfs-http-client';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchHead,setBranchHead] = useState('');
  const [studentSchoolName, setStudentSchoolName]= useState('');
  const [studentBranchName, setStudentBranchName]= useState('');
  const [studentDepartmentName, setStudentDepartmentName]= useState('');
  const [studentId, setStudentId] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');
  const [schools, setSchools] = useState({});
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolHeadAddress, setSchoolHeadAddress] = useState('');
  const [file, setFile] = useState('');
  const [departmentSchoolName, setDepartmentSchoolName]= useState('');

  const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        console.log('Using window.ethereum');
        setWeb3(new Web3(window.ethereum));
        try {
          await window.ethereum.enable();
          console.log('Account access granted');
        } catch (error) {
          console.error('User denied account access');
        }
      } else if (window.web3) {
        console.log('Using window.web3');
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        console.error('No Ethereum browser extension detected');
      }
    };
  
    initWeb3();
  }, []);
  

  useEffect(() => {
    const initContract = async () => {
      if (web3) {
        const networkId = 80001; // Set the network ID to 80001 for Mumbai Polygon
        const deployedAddress = CONTRACT_ADDRESSES; // Replace with your contract address

        const instance = new web3.eth.Contract(CONTRACT_ABI, deployedAddress);
        setContract(instance);
        loadSchools(instance);
      }
    };

    initContract();
  }, [web3]);

  const loadSchool = async (contract, schoolName) => {
    const departmentCount = await contract.methods.getDepartmentsCount(schoolName).call();
    const departments = {};
  
    for (let i = 0; i < departmentCount; i++) {
      const departmentName = await contract.methods.getDepartmentByIndex(schoolName, i).call();
      departments[departmentName] = await loadDepartment(contract, schoolName, departmentName);

    }
  
    return { departments };
  };
  const loadDepartment = async (contract, schoolName, departmentName) => {
    const branchCount = await contract.methods.getBranchesCount(schoolName, departmentName).call();
    const branches = {};
  
    for (let i = 0; i < branchCount; i++) {
      const branchName = await contract.methods.getBranchByIndex(schoolName, departmentName, i).call();
      branches[branchName] = await loadBranch(contract, schoolName, departmentName, branchName);
    }
  
    return { branches };
  };

  const loadBranch = async (contract, schoolName, departmentName, branchName) => {
    const studentCount = await contract.methods.getStudentsCount(schoolName, departmentName, branchName).call();
    const students = {};
  
    for (let i = 0; i < studentCount; i++) {
      const studentId = await contract.methods.getStudentByIndex(schoolName, departmentName, branchName, i).call();
      students[studentId] = await loadStudent(contract, schoolName, departmentName, branchName, studentId);
    }
  
    return { students };
  };
  

  const loadSchools = async (contract) => {
    const schoolsCount = await contract.methods.getSchoolsCount().call();
    const loadedSchools = {};
  
    for (let i = 0; i < schoolsCount; i++) {
      const schoolData = await contract.methods.getSchoolByIndex(i).call();
      const schoolName = schoolData.name; // Replace 'name' with the actual property name for school names in your contract
      loadedSchools[schoolName] = await loadSchool(contract, schoolName);
    }
  
    setSchools(loadedSchools);
  };
  
  
  const loadDepartments = async (contract, schoolName) => {
    const departmentCount = await contract.methods.getDepartmentCount(schoolName).call();
    const departments = {};
  
    for (let i = 0; i < departmentCount; i++) {
      const departmentName = await contract.methods.getDepartmentNameByIndex(schoolName, i).call();
      departments[departmentName] = await loadBranches(contract, schoolName, departmentName);
    }
  
    return { departments };
  };
  
  const loadBranches = async (contract, schoolName, departmentName) => {
    const branchCount = await contract.methods.getBranchCount(schoolName, departmentName).call();
    const branches = {};
  
    for (let i = 0; i < branchCount; i++) {
      const branchName = await contract.methods.getBranchNameByIndex(schoolName, departmentName, i).call();
      branches[branchName] = await loadStudents(contract, schoolName, departmentName, branchName);
    }
  
    return { branches };
  };
  
  const loadStudents = async (contract, schoolName, departmentName, branchName) => {
    const studentCount = await contract.methods.getStudentCount(schoolName, departmentName, branchName).call();
    const students = {};
  
    for (let i = 0; i < studentCount; i++) {
      const studentId = await contract.methods.getStudentIdByIndex(schoolName, departmentName, branchName, i).call();
      students[studentId] = await loadStudent(contract, schoolName, departmentName, branchName, studentId);
    }
  
    return { students };
  };
  const loadStudent = async (contract, schoolName, departmentName, branchName, studentId) => {
    const student = await contract.methods.getStudent(schoolName, departmentName, branchName, studentId).call();
    return {
      id: student.id,
      branchHead: student.branchHead,
      fileAccepted: student.fileAccepted,
      fileContent: student.fileContent,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!contract) {
      return;
    }
    const SHA256 = require('crypto-js/sha256');

    const accounts = await web3.eth.getAccounts();

    switch (event.target.name) {
      case 'addSchool':
        await contract.methods.addSchool(schoolName, schoolAddress).send({ from: accounts[0] });
        break;
      case 'addSchoolHead':
        await contract.methods.addSchoolHead(schoolHeadAddress).send({ from: accounts[0] });
        break;
      case 'addDepartment':
        await contract.methods.addDepartment(departmentSchoolName, departmentName).send({ from: accounts[0] });
        break;
      case 'addBranch':
        await contract.methods.addBranch(schoolName, departmentName, branchName).send({ from: accounts[0] });
        break;
      case 'addBranchHead':
        await contract.methods.addBranchHead(branchHead).send({from: accounts[0]});
        break;
      case 'addStudent':
        await contract.methods.addStudent(schoolName, departmentName, branchName, studentId).send({ from: accounts[0] });
        break;
      case 'sendFile':
        const fileData = new FormData();
        fileData.append('file', file);

        const { cid } = await ipfs.addAll(fileData);
        const fileHash = cid.toString();

        // Calculate file hash before calling the smart contract
        const fileReader = new FileReader();
        fileReader.onloadend = async () => {
          const content = Buffer.from(fileReader.result);
          const fileHash = SHA256(content).toString(); // Calculate SHA-256 hash

          await contract.methods
            .sendFile(schoolName, departmentName, branchName, studentId, fileHash, file.size, file.type, file.name)
            .send({ from: accounts[0] });
        };
        fileReader.readAsArrayBuffer(file);

      break;

      case 'acceptFile':
        await contract.methods.acceptFile(schoolName, departmentName, branchName, studentId).send({ from: accounts[0] });
        break;
      case 'rejectFile':
        await contract.methods.rejectFile(schoolName, departmentName, branchName, studentId).send({ from: accounts[0] });
        break;
      default:
        break;
    }

    // Reload the schools after a transaction
    loadSchools(contract);
  };

  const renderSchools = () => {
    return Object.keys(schools).map((schoolName) => {
      return (
        <div key={schoolName}>
          <h3>{schoolName}</h3>
          {renderDepartments(schoolName)}
        </div>
      );
    });
  };

  const renderDepartments = (schoolName) => {
    const departments = schools[schoolName].departments;
    return Object.keys(departments).map((departmentName) => {
      return (
        <div key={departmentName}>
          <h4>{departmentName}</h4>
          {renderBranches(schoolName, departmentName)}
        </div>
      );
    });
  };

  const renderBranches = (schoolName, departmentName) => {
    const branches = schools[schoolName].departments[departmentName].branches;
    return Object.keys(branches).map((branchName) => {
      return (
        <div key={branchName}>
          <h5>{branchName}</h5>
          {renderStudents(schoolName, departmentName, branchName)}
        </div>
      );
    });
  };

  const renderStudents = (schoolName, departmentName, branchName) => {
    const students = schools[schoolName].departments[departmentName].branches[branchName].students;
    return Object.keys(students).map((studentId) => {
      const student = students[studentId];
      return (
        <Table.Row key={studentId}>
          <Table.Cell>{student.id}</Table.Cell>
          <Table.Cell>{student.branchHead}</Table.Cell>
          <Table.Cell>{student.fileAccepted ? 'Accepted' : 'Pending'}</Table.Cell>
          <Table.Cell>{student.fileContent}</Table.Cell>
          <Table.Cell>
            <Button
              primary
              disabled={!student.fileContent || student.fileAccepted}
              onClick={() => handleAcceptFile(schoolName, departmentName, branchName, studentId)}
            >
              Accept
            </Button>
            <Button
              primary
              disabled={!student.fileContent || student.fileAccepted}
              onClick={() => handleRejectFile(schoolName, departmentName, branchName, studentId)}
            >
              Reject
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  const handleAcceptFile = async (schoolName, departmentName, branchName, studentId) => {
    if (!contract) {
      return;
    }

    const accounts = await web3.eth.getAccounts();
    await contract.methods.acceptFile(schoolName, departmentName, branchName, studentId).send({ from: accounts[0] });

    // Reload the schools after a transaction
    loadSchools(contract);
  };

  const handleRejectFile = async (schoolName, departmentName, branchName, studentId) => {
    if (!contract) {
      return;
    }

    const accounts = await web3.eth.getAccounts();
    await contract.methods.rejectFile(schoolName, departmentName, branchName, studentId).send({ from: accounts[0] });

    // Reload the schools after a transaction
    loadSchools(contract);
  };

  return (
    <Router>
      <div className='container'>
        <div className="App-name">
          <div className='logo'>
            <img src="http://www.ipu.ac.in/style/head_foot_img/220px-usemGuru_Gobind_Singh_Indraprastha_University12.png" alt="logo" />
            <h1>GGSIPU</h1>
          </div>
  
          {renderSchools()}
          <div className="navigation">
            <nav>
              <Link to="/">Home  |</Link>
              <Link to="/add-school">  Add School  |</Link>
              <Link to="/add-schoolHead">  Add School Head  |</Link>
              <Link to="/add-department">  Add Department  |</Link>
              <Link to="/add-branch">Add Branch  |</Link>
              <Link to="/add-branch-head">  Add Branch Head  |</Link>
              <Link to="/add-student">Add Student  |</Link>
              <Link to="/send-file">Send File </Link>
            </nav>
          </div>
        </div>
  
        
  
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={(
                <div className='heading-logo'>
                  <h1>GGSIPU FILE MANAGEMENT SYSTEM</h1>
                  {renderSchools()}
                </div>
              )}
            />
  
            <Route
              path="/add-school"
              element={(
                <Form name="addSchool" onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>School Name</label>
                    <Input placeholder="School Name" onChange={(e) => setSchoolName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>School Address</label>
                    <Input placeholder="School Address" onChange={(e) => setSchoolAddress(e.target.value)} />
                  </Form.Field>
                  <Button type="submit">Add School</Button>
                </Form>
              )}
            />
  
            {/* Add other routes for adding departments, branches, students, etc. */}
  
            <Route
              path="/add-department"
              element={(
                <Form name="addDepartment" onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>School Name</label>
                    <Input placeholder="School Name" onChange={(e) => setDepartmentSchoolName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Department Name</label>
                    <Input placeholder="Department Name" onChange={(e) => setDepartmentName(e.target.value)} />
                  </Form.Field>
                  
                  <Button type="submit">Add Department</Button>
                </Form>
              )}
            />
  
            <Route
              path="/add-schoolHead"
              element={(
                <Form name="addSchoolHead" onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>School Head Address</label>
                    <Input placeholder="School Head Address" onChange={(e) => setSchoolHeadAddress(e.target.value)} />
                  </Form.Field>
                  <Button type="submit">Add School Head</Button>
                </Form>
              )}
            />

            <Route
              path="/add-branch"
              element={(
                <Form name="addBranch" onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>School Name</label>
                    <Input placeholder="School Name" onChange={(e) => setSchoolName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Department Name</label>
                    <Input placeholder="Department Name" onChange={(e) => setDepartmentName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Branch Name</label>
                    <Input placeholder="Branch Name" onChange={(e) => setBranchName(e.target.value)} />
                  </Form.Field>
                  <Button type="submit">Add Branch</Button>
                </Form>
              )}
            />

            <Route
              path="/add-branch-head"
              element={(
                <Form name="addBranch" onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>Branch Head Name</label>
                    <Input placeholder="Branch Head Address" onChange={(e) => setBranchHead(e.target.value)} />
                  </Form.Field>
                  <Button type="submit">Add School Head</Button>
                </Form>
              )}
            />

            <Route
              path="/add-student"
              element={(
                <Form name="addStudent" onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>School Name</label>
                    <Input placeholder="School Name" onChange={(e) => setSchoolName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Department Name</label>
                    <Input placeholder="Department Name" onChange={(e) => setDepartmentName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Branch Name</label>
                    <Input placeholder="Branch Name" onChange={(e) => setBranchName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Student ID</label>
                    <Input placeholder="Student ID" onChange={(e) => setStudentId(e.target.value)} />
                  </Form.Field>
                  <Button type="submit">Add Student</Button>
                </Form>
              )}
            />

            <Route
              path="/send-file"
              element={(
                <Form name="sendFile" onSubmit={handleSubmit}>
                  <Form.Field>
                    <label>School Name</label>
                    <Input placeholder="School Name" onChange={(e) => setSchoolName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Department Name</label>
                    <Input placeholder="Department Name" onChange={(e) => setDepartmentName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Branch Name</label>
                    <Input placeholder="Branch Name" onChange={(e) => setBranchName(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Student ID</label>
                    <Input placeholder="Student ID" onChange={(e) => setStudentId(e.target.value)} />
                  </Form.Field>
                  <Form.Field>
                    <label>File</label>
                    <Input type="file" name="fileInput" onChange={(e) => setFile(e.target.files[0])} />
                  </Form.Field>
                  <Button type="submit">Send File</Button>
                </Form>
              )}
            />


          </Routes>
        </div>
      </div>
    </Router>
  );
  
};

export default App;