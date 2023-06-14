import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table } from 'semantic-ui-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Web3 from 'web3';
import { CONTRACT_ADDRESSES, CONTRACT_ABI } from './contract';
import './App.css';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');
  const [schools, setSchools] = useState({});
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolHeadName, setSchoolHeadName] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        setWeb3(new Web3(window.ethereum));
        try {
          await window.ethereum.enable();
        } catch (error) {
          console.error('User denied account access');
        }
      } else if (window.web3) {
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

    const accounts = await web3.eth.getAccounts();

    switch (event.target.name) {
      case 'addSchool':
        await contract.methods.addSchool(schoolName, schoolAddress).send({ from: accounts[0] });
        break;
      case 'addDepartment':
        await contract.methods.addDepartment(schoolName, departmentName).send({ from: accounts[0] });
        break;
      case 'addBranch':
        await contract.methods.addBranch(schoolName, departmentName, branchName).send({ from: accounts[0] });
        break;
      case 'addStudent':
        await contract.methods.addStudent(schoolName, departmentName, branchName, studentId).send({ from: accounts[0] });
        break;
      case 'sendFile':
        await contract.methods
          .sendFile(schoolName, departmentName, branchName, studentId, fileHash, fileSize, fileType, fileName)
          .send({ from: accounts[0] });
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
      <div >
        <nav className="App">
          <Link to="/">Home</Link>
          <br></br>
          <Link to="/add-school">Add School</Link>
          <br></br>
          <Link to="/add-schoolHead">Add School Head</Link>
          <br></br>
          <Link to="/add-department">Add Department</Link>

        </nav>

        <div className="bodyOk">
        <Routes>
          
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
                  <label>School Head Name</label>
                  <Input placeholder="School Head Name" onChange={(e) => setSchoolHeadName(e.target.value)} />
                </Form.Field>
                <Button type="submit">Add School Head</Button>
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
