// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Mock AWS SDK
const mockDynamoDB = jest.fn();
const mockS3 = jest.fn();
const mockStepFunctions = jest.fn();
const mockEcs = jest.fn();
const mockCloudWatch = jest.fn();
const mockCloudWatchLogs = jest.fn();
const mockCloudWatchEvents = jest.fn();
const mockLambda = jest.fn();
const mockCloudFormation = jest.fn();
const mockAWS = require('aws-sdk');
mockAWS.S3 = jest.fn(() => ({
  putObject: mockS3
}));
mockAWS.StepFunctions = jest.fn(() => ({
  startExecution: mockStepFunctions
}));
mockAWS.config = jest.fn(() => ({
  logger: Function
}));
mockAWS.DynamoDB.DocumentClient = jest.fn(() => ({
  scan: mockDynamoDB,
  delete: mockDynamoDB,
  update: mockDynamoDB,
  get: mockDynamoDB,
  query: mockDynamoDB,
  batchWrite: mockDynamoDB
}));
mockAWS.CloudWatch = jest.fn(() => ({
  deleteDashboards: mockCloudWatch
}));
mockAWS.CloudWatchLogs = jest.fn(() => ({
  deleteMetricFilter: mockCloudWatchLogs
}));
mockAWS.CloudWatchEvents = jest.fn(() => ({
  putRule: mockCloudWatchEvents,
  putTargets: mockCloudWatchEvents,
  removeTargets: mockCloudWatchEvents,
  deleteRule: mockCloudWatchEvents,
  listRules: mockCloudWatchEvents,
}));
mockAWS.Lambda = jest.fn(() => ({
  addPermission: mockLambda,
  removePermission: mockLambda,
  update: mockDynamoDB,
  get: mockDynamoDB,
  invoke: mockLambda
}));
mockAWS.CloudFormation = jest.fn(() => ({
  listExports: mockCloudFormation
}));

Date.now = jest.fn(() => new Date("2017-04-22T02:28:37.000Z"));

const testId = '1234';
const listData = {
  Items: [
    { testId: '1234' },
    { testId: '5678' }
  ]
};

let getData = {
  Item: {
    testId: '1234',
    name: 'mytest',
    status: 'running',
    testScenario: "{\"name\":\"example\"}",
    testTaskConfigs: [
      {
        region: "us-east-1",
        concurrency: "5",
        taskCount: "5"
      }
    ]
  }
};
const origData = getData;

let getDataWithConfigs = {
  Item: {
    testId: '1234',
    name: 'mytest',
    status: 'running',
    testScenario: "{\"name\":\"example\"}",
    testTaskConfigs: [
      {
        region: 'us-east-1',
        concurrency: '5',
        taskCount: '5',
        ecsCloudWatchLogGroup: 'testCluster-DLTEcsDLTCloudWatchLogsGroup',
        taskCluster: 'testCluster',
        taskDefinition: 'arn:aws:ecs:us-east-1:123456789012:task-definition/testTaskDef1:1',
        subnetA: 'subnet-456def',
        subnetB: 'subnet-123abc',
        taskImage: 'test-load-tester-image',
        taskSecurityGroup: 'sg-000000'
      },
      {
        testId: "region-eu-west-1",
        concurrency: '5',
        taskCount: '5',
        ecsCloudWatchLogGroup: "testClusterEU-DLTEcsDLTCloudWatchLogsGroup",
        taskCluster: "testClusterEU",
        taskDefinition: "arn:aws:ecs:eu-west-1:123456789012:task-definition/testTaskDef2:1",
        subnetB: "subnet-abc123",
        region: "eu-west-1",
        taskImage: "eu-test-load-tester-image",
        subnetA: "subnet-def456",
        taskSecurityGroup: "sg-111111"
      }
    ],
  }
};

let getDataWithNoConfigs = {
  Item: {
    testId: '1234',
    name: 'mytest',
    status: 'running',
    testScenario: "{\"name\":\"example\"}",
  }
};

let getDataWithEmptyConfigs = {
  Item: {
    testId: '1234',
    name: 'mytest',
    status: 'running',
    testScenario: "{\"name\":\"example\"}",
    testTaskConfigs: [{}],
  }
};

const tasks1 = {
  "taskArns": ["arn:of:task1", "arn:of:task2", "arn:of:task3"],
  "nextToken": true
};

const tasks2 = {
  "taskArns": ["arn:of:task4", "arn:of:task5", "arn:of:task6"]
};

const multiRegionTasksList = [
  {
    region: 'us-east-1',
    taskArns: [
      "arn:of:task1", "arn:of:task2", "arn:of:task3", "arn:of:task4", "arn:of:task5", "arn:of:task6"
    ]
  }, {
    region: 'eu-west-1',
    taskArns: [
      "arn:of:task1", "arn:of:task2", "arn:of:task3", "arn:of:task4", "arn:of:task5", "arn:of:task6"
    ]
  }];

const updateData = {
  Attributes: { testStatus: 'running' }
};

const config = {
  testName: "mytest",
  testDescription: "test",
  testTaskConfigs: [
    {
      "region": "us-east-1",
      "concurrency": "5",
      "taskCount": "5"
    },
    {
      "region": "eu-west-1",
      "concurrency": "5",
      "taskCount": "5"
    }
  ],
  testScenario: {
    execution: [
      {
        "ramp-up": "30s",
        "hold-for": "1m"
      }
    ]
  },
  scheduleDate: "2018-02-28",
  scheduleTime: "12:30",
};

const context = {
  functionName: "lambdaFunctionName",
  invokedFunctionArn: "arn:of:lambdaFunctionName"
};

const rulesResponse = {
  Rules: [
    {
      Arn: 'arn:of:rule/123',
      Name: '123'
    }
  ]
};

const getRegionalConf = {
  Item: {
    testId: "region-us-east-1",
    ecsCloudWatchLogGroup: "testCluster-DLTEcsDLTCloudWatchLogsGroup",
    taskCluster: "testCluster",
    taskDefinition: "arn:aws:ecs:us-east-1:123456789012:task-definition/testTaskDef1:1",
    subnetB: "subnet-123abc",
    region: "us-east-1",
    taskImage: "test-load-tester-image",
    subnetA: "subnet-456def",
    taskSecurityGroup: "sg-000000"
  }
};

const getRegionalConf2 = {
  Item: {
    testId: "region-eu-west-1",
    ecsCloudWatchLogGroup: "testClusterEU-DLTEcsDLTCloudWatchLogsGroup",
    taskCluster: "testClusterEU",
    taskDefinition: "arn:aws:ecs:eu-west-1:123456789012:task-definition/testTaskDef2:1",
    subnetB: "subnet-abc123",
    region: "eu-west-1",
    taskImage: "eu-test-load-tester-image",
    subnetA: "subnet-def456",
    taskSecurityGroup: "sg-111111"
  }
};

const notRegionalConf = {
  'ResponseMetadata': {
    'RequestId': '1234567890ABCDEF'
  }
};

const getAllRegionalConfs = {
  Items: [{
    testId: "region-us-east-1",
    ecsCloudWatchLogGroup: "testClusterUS-DLTEcsDLTCloudWatchLogsGroup",
    taskCluster: "testClusterUS",
    taskDefinition: "arn:aws:ecs:us-east-1:123456789012:task-definition/testTaskDef1:1",
    subnetB: "subnet-123abc",
    region: "us-east-1",
    taskImage: "us-test-load-tester-image",
    subnetA: "subnet-456def",
    taskSecurityGroup: "sg-000000"
  },
  {
    testId: "region-eu-west-1",
    ecsCloudWatchLogGroup: "testClusterEU-DLTEcsDLTCloudWatchLogsGroup",
    taskCluster: "testClusterEU",
    taskDefinition: "arn:aws:ecs:eu-west-1:123456789012:task-definition/testTaskDef2:1",
    subnetB: "subnet-abc123",
    region: "eu-west-1",
    taskImage: "eu-test-load-tester-image",
    subnetA: "subnet-def456",
    taskSecurityGroup: "sg-111111"
  }
  ]
};

const historyEntries = {
  "Items": [
    {
      "testTaskConfigs": [
        {
          "taskCount": 1,
          "taskCluster": "testTaskCluster1",
          "subnetA": "subnet-aaaaa",
          "ecsCloudWatchLogGroup": "testEcsCWG1",
          "subnetB": "subnet-bbbbbbd",
          "taskImage": "testTaskImage1",
          "testId": "testId1",
          "taskDefinition": "arn:test:taskGroup/testTaskDef:1",
          "completed": 1,
          "region": "us-west-2",
          "taskSecurityGroup": "sg-111111",
          "concurrency": 100
        }
      ],
      "testType": "simple",
      "status": "complete",
      "succPercent": "100.00",
      "testRunId": "testRunId",
      "startTime": "2022-03-26 23:42:14",
      "testDescription": "test description",
      "testId": "testId",
      "endTime": "2022-03-26 23:48:25",
      "results": {
        "avg_lt": "0.03658",
        "p0_0": "0.127",
        "p99_0": "0.375",
        "stdev_rt": "0.069",
        "avg_ct": "0.02612",
        "concurrency": "1",
        "p99_9": "1.784",
        "labels": [
          {
            "avg_lt": "0.03658",
            "p0_0": "0.127",
            "p99_0": "0.375",
            "stdev_rt": "0.069",
            "avg_ct": "0.02612",
            "label": "https://test.url",
            "concurrency": "1",
            "p99_9": "1.784",
            "fail": 0,
            "rc": [],
            "succ": 967,
            "p100_0": "1.784",
            "bytes": "5384054559",
            "p95_0": "0.244",
            "avg_rt": "0.18487",
            "throughput": 967,
            "p90_0": "0.219",
            "testDuration": "0",
            "p50_0": "0.181"
          }
        ],
        "fail": 0,
        "rc": [],
        "succ": 967,
        "p100_0": "1.784",
        "bytes": "5384054559",
        "p95_0": "0.244",
        "avg_rt": "0.18487",
        "throughput": 967,
        "p90_0": "0.219",
        "testDuration": "180",
        "p50_0": "0.181"
      },
      "region": "us-west-2",
      "metricS3Location": "testS3Location",
      "testScenario": {
        "execution": [
          {
            "scenario": "testScenario1",
            "ramp-up": "0m",
            "hold-for": "3m"
          }
        ],
        "reporting": [
          {
            "summary": true,
            "dump-xml": "testXML/location",
            "percentiles": true,
            "test-duration": true,
            "summary-labels": true,
            "module": "final-stats"
          }
        ],
        "scenarios": {
          "testScenario": {
            "requests": [
              {
                "headers": {},
                "method": "GET",
                "body": {},
                "url": "https://test.url"
              }
            ]
          }
        }
      }
    }
  ]
};

const getStackExports = {
  Exports: [{
    ExportingStackId: 'arn:of:cloudformation:stack/stackName/abc-def-hij-123',
    Name: 'RegionalCFTemplate',
    Value: 'https://s3-test-url/prefix/regional.template'
  },
  {
    ExportingStackId: 'arn:of:cloudformation:stack/notTheStack/xyz-456',
    Name: 'NotTheExport',
    Value: 'https://s3-test-url/IncorrectURL/wrong.template'
  }
  ]
};

const errorNoStackExports = {
  Exports: [{}]
};

const noUnprocessedItems = { UnprocessedItems: {} };
const unprocessedItems = {
  UnprocessedItems:
  {
    testHistoryTable:
      [
        {
          "DeleteRequest": {
            "Key": {
              "testId": "1234", "testRunId": "testRunId"
            }
          }
        }]
  }
};

process.env.SCENARIOS_BUCKET = 'bucket';
process.env.SCENARIOS_TABLE = 'testScenariosTable';
process.env.HISTORY_TABLE = 'testHistoryTable';
process.env.STATE_MACHINE_ARN = 'arn:of:state:machine';
process.env.LAMBDA_ARN = 'arn:of:apilambda';
process.env.TASK_CANCELER_ARN = 'arn:of:taskCanceler';
process.env.SOLUTION_ID = 'SO0062';
process.env.STACK_ID = 'arn:of:cloudformation:stack/stackName/abc-def-hij-123';
process.env.VERSION = '3.0.0';

const lambda = require('./index.js');

describe('#SCENARIOS API:: ', () => {
  beforeEach(() => {
    mockS3.mockReset();
    mockDynamoDB.mockReset();
    mockStepFunctions.mockReset();
    mockEcs.mockReset();
    mockCloudWatch.mockReset();
    mockCloudWatchEvents.mockReset();
    mockLambda.mockReset();
    mockCloudFormation.mockReset();
    getData = { ...origData };
  });

  //Positive tests
  it('should return "SUCCESS" when "LISTTESTS" returns success', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // scan
          return Promise.resolve(listData);
        }
      };
    });

    const response = await lambda.listTests();
    expect(response.Items[0].testId).toEqual('1234');
  });

  it('should return "SUCCESS" when "GETTEST" returns success', async () => {
    mockAWS.ECS = jest.fn(() => ({
      listTasks: mockEcs,
      describeTasks: mockEcs
    }));
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          //get history
          return Promise.resolve(historyEntries);
        }
      };
    });
    mockEcs.mockImplementation(() => {
      return {
        promise() {
          // listTasks
          return Promise.resolve(tasks2);
        }
      };
    });
    mockEcs.mockImplementationOnce(() => {
      return {
        promise() {
          //describeTasks
          return Promise.resolve({
            tasks: [
              { group: testId },
              { group: testId },
              { group: "notTestId" }
            ]
          });
        }
      };
    });

    const response = await lambda.getTest(testId);
    expect(response.name).toEqual('mytest');
  });

  it('should return "SUCCESS" when "listTask" returns success', async () => {
    mockAWS.ECS = jest.fn(() => ({
      listTasks: mockEcs
    }));
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getAllRegionalConfs);
        }
      };
    });
    mockEcs.mockImplementationOnce(() => {
      return {
        promise() {
          // listTasks
          return Promise.resolve(tasks1);
        }
      };
    });
    mockEcs.mockImplementationOnce(() => {
      return {
        promise() {
          // listTasks
          return Promise.resolve(tasks2);
        }
      };
    });
    mockEcs.mockImplementationOnce(() => {
      return {
        promise() {
          // listTasks
          return Promise.resolve(tasks1);
        }
      };
    });
    mockEcs.mockImplementationOnce(() => {
      return {
        promise() {
          // listTasks
          return Promise.resolve(tasks2);
        }
      };
    });

    const response = await lambda.listTasks();
    expect(response).toEqual(multiRegionTasksList);
  });

  it('should return "SUCCESS" when "DELETETEST" returns success', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          //get test run IDs
          return Promise.resolve(historyEntries);
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // batchWrite
          return Promise.resolve(noUnprocessedItems);
        }
      };
    });

    mockCloudWatchLogs.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockCloudWatch.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockCloudWatchEvents.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });

    const response = await lambda.deleteTest(testId, context.functionName);
    expect(response).toEqual('success');
  });

  it('should return "SUCCESS" when "DELETETEST" has unprocessed entries from "deleteTestHistory', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          //get test run IDs
          return Promise.resolve(historyEntries);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // delete
          return Promise.resolve(unprocessedItems);
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // batchWrite
          return Promise.resolve(noUnprocessedItems);
        }
      };
    });
    mockCloudWatchLogs.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockCloudWatch.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockCloudWatchEvents.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });

    const response = await lambda.deleteTest(testId, context.functionName);
    expect(response).toEqual('success');
  });

  it('DELETE should return "SUCCESS" when no metrics are found', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // delete
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          //get test run IDs
          return Promise.resolve(historyEntries);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // delete
          return Promise.resolve(noUnprocessedItems);
        }
      };
    });
    mockCloudWatchLogs.mockImplementation(() => {
      return {
        promise() {
          return Promise.reject({
            code: 'ResourceNotFoundException',
            statusCode: 400
          });
        }
      };
    });
    mockCloudWatch.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockCloudWatchEvents.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });

    const response = await lambda.deleteTest(testId, context.functionName);
    expect(response).toEqual('success');
  });

  it('should return "SUCCESS" when "CREATETEST" returns success', async () => {
    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockStepFunctions.mockImplementation(() => {
      return {
        promise() {
          // startExecution
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(updateData);
        }
      };
    });
    const response = await lambda.createTest(config);
    expect(response.testStatus).toEqual('running');
  });

  it('should record proper date when "CREATETEST" with daily recurrence', async () => {
    config.recurrence = "daily";
    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });
    mockStepFunctions.mockImplementation(() => {
      return {
        promise() {
          // startExecution
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(updateData);
        }
      };
    });

    const response = await lambda.createTest(config);
    expect(response.testStatus).toEqual('running');
    expect(mockDynamoDB).toHaveBeenCalledWith(expect.objectContaining({
      ExpressionAttributeValues: expect.objectContaining({
        ":nr": "2017-04-23 02:28:37"
      })
    }));
    //reset config
    delete config.recurrence;
  });

  it('should record proper date when "CREATETEST" with weekly recurrence', async () => {
    config.recurrence = "weekly";

    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });
    mockStepFunctions.mockImplementation(() => {
      return {
        promise() {
          // startExecution
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // update
          return Promise.resolve(updateData);
        }
      };
    });

    const response = await lambda.createTest(config);
    expect(response.testStatus).toEqual('running');
    expect(mockDynamoDB).toHaveBeenCalledWith(expect.objectContaining({
      ExpressionAttributeValues: expect.objectContaining({
        ":nr": "2017-04-29 02:28:37"
      })
    }));
    //reset config
    delete config.recurrence;
  });

  it('should record proper date when "CREATETEST" with biweekly recurrence', async () => {
    config.recurrence = "biweekly";

    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });
    mockStepFunctions.mockImplementation(() => {
      return {
        promise() {
          // startExecution
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // update
          return Promise.resolve(updateData);
        }
      };
    });

    const response = await lambda.createTest(config);
    expect(response.testStatus).toEqual('running');
    expect(mockDynamoDB).toHaveBeenCalledWith(expect.objectContaining({
      ExpressionAttributeValues: expect.objectContaining({
        ":nr": "2017-05-06 02:28:37"
      })
    }));
    //reset config
    delete config.recurrence;
  });

  it('should record proper date when "CREATETEST" with daily recurrence', async () => {
    config.recurrence = "monthly";

    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });
    mockStepFunctions.mockImplementation(() => {
      return {
        promise() {
          // startExecution
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // update
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // update
          return Promise.resolve(updateData);
        }
      };
    });
    const response = await lambda.createTest(config);
    expect(response.testStatus).toEqual('running');
    expect(mockDynamoDB).toHaveBeenCalledWith(expect.objectContaining({
      ExpressionAttributeValues: expect.objectContaining({
        ":nr": "2017-05-22 02:28:37"
      })
    }));
    //reset config
    delete config.recurrence;
  });

  it('should return SUCCESS when "CANCELTEST" finds running tasks and returns success', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //invoke TaskCanceler lambda function
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          Promise.resolve();
        }
      };
    });

    const response = await lambda.cancelTest(testId);
    expect(response).toEqual("test cancelling");

  });

  it('should return SUCCESS when "SCHEDULETEST" returns success and scheduleStep is "create"', async () => {
    config.scheduleStep = 'create';
    config.recurrence = 'daily';
    eventInput = { body: JSON.stringify(config) };

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //listRule
          return Promise.resolve({ Rules: [] });
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putRule
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //putPermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putTargets
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      let scheduleData = updateData;
      scheduleData.Attributes.testStatus = 'scheduled';
      return {
        promise() {
          // update
          return Promise.resolve(scheduleData);
        }
      };
    });

    const response = await lambda.scheduleTest(eventInput, context);
    expect(response.testStatus).toEqual('scheduled');

    //reset config
    delete config.recurrence;
    delete config.scheduleStep;
  });

  it('should return SUCCESS and record proper next daily run when "SCHEDULETEST" returns success when scheduleStep is start and recurrence exists', async () => {
    config.scheduleStep = 'start';
    config.recurrence = 'daily';
    eventInput = { body: JSON.stringify(config) };

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //listRule
          return Promise.resolve({ Rules: [] });
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putRule
          return Promise.resolve({ RuleArn: 'arn:of:rule/123' });
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //putPermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putTargets
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //removePermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      let scheduleData = updateData;
      scheduleData.Attributes.testStatus = 'scheduled';
      return {
        promise() {
          // update
          return Promise.resolve(scheduleData);
        }
      };
    });

    await lambda.scheduleTest(eventInput, context);
    expect(mockCloudWatchEvents).toHaveBeenNthCalledWith(2, expect.objectContaining({
      "ScheduleExpression": "rate(1 day)"
    }));
    //reset config
    delete config.recurrence;
    delete config.scheduleStep;
  });

  it('should return SUCCESS and record proper next weekly run when "SCHEDULETEST" returns success withe scheduleStep is start and recurrence exists', async () => {
    config.scheduleStep = 'start';
    config.recurrence = 'weekly';
    eventInput = { body: JSON.stringify(config) };

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //listRule
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //delete target
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //delete permission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //delete rule
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putRule
          return Promise.resolve({ RuleArn: 'arn:of:rule/123' });
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //putPermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putTargets
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //removePermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeRule
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      let scheduleData = updateData;
      scheduleData.Attributes.testStatus = 'scheduled';
      return {
        promise() {
          // update
          return Promise.resolve(scheduleData);
        }
      };
    });

    await lambda.scheduleTest(eventInput, context);
    expect(mockCloudWatchEvents).toHaveBeenNthCalledWith(4, expect.objectContaining({
      "ScheduleExpression": "rate(7 days)"
    }));
    //reset config
    delete config.recurrence;
    delete config.scheduleStep;
  });

  it('should return SUCCESS and record proper next biweekly run when "SCHEDULETEST" returns success withe scheduleStep is start and recurrence exists', async () => {
    config.scheduleStep = 'start';
    config.recurrence = 'biweekly';
    eventInput = { body: JSON.stringify(config) };

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //listRule
          return Promise.resolve({ Rules: [] });
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putRule
          return Promise.resolve({ RuleArn: 'arn:of:rule/123' });
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //putPermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putTargets
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //removePermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      let scheduleData = updateData;
      scheduleData.Attributes.testStatus = 'scheduled';
      return {
        promise() {
          // update
          return Promise.resolve(scheduleData);
        }
      };
    });

    await lambda.scheduleTest(eventInput, context);
    expect(mockCloudWatchEvents).toHaveBeenNthCalledWith(2, expect.objectContaining({
      "ScheduleExpression": "rate(14 days)"
    }));
    //reset config
    delete config.recurrence;
    delete config.scheduleStep;
  });

  it('should return SUCCESS and record proper next monthly run when "SCHEDULETEST" returns success and scheduleStep is start and recurrence exists', async () => {
    config.scheduleStep = 'start';
    config.recurrence = 'monthly';
    eventInput = { body: JSON.stringify(config) };

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //listRule
          return Promise.resolve({ Rules: [] });
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putRule
          return Promise.resolve({ RuleArn: 'arn:of:rule/123' });
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //putPermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putTargets
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //removePermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      let scheduleData = updateData;
      scheduleData.Attributes.testStatus = 'scheduled';
      return {
        promise() {
          // update
          return Promise.resolve(scheduleData);
        }
      };
    });

    await lambda.scheduleTest(eventInput, context);
    expect(mockCloudWatchEvents).toHaveBeenNthCalledWith(2, expect.objectContaining({
      "ScheduleExpression": "cron(30 12 28 * ? *)"
    }));
    //reset config
    delete config.recurrence;
    delete config.scheduleStep;
  });

  it('should return SUCCESS, and records proper nextRun when "SCHEDULETEST" returns success withe scheduleStep is start and no recurrence', async () => {
    config.scheduleStep = 'start';
    eventInput = { body: JSON.stringify(config) };

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //listRule
          return Promise.resolve({ Rules: [] });
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putRule
          return Promise.resolve({ RuleArn: 'arn:of:rule/123' });
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //putPermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //putTargets
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeTargets
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //removePermission
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //removeRule
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      let scheduleData = updateData;
      scheduleData.Attributes.testStatus = 'scheduled';
      return {
        promise() {
          // update
          return Promise.resolve(scheduleData);
        }
      };
    });

    const response = await lambda.scheduleTest(eventInput, context);
    expect(response.testStatus).toEqual('scheduled');
    expect(mockDynamoDB).toHaveBeenCalledWith(expect.objectContaining({
      ExpressionAttributeValues: expect.objectContaining({
        ":nr": "2018-02-28 12:30:00"
      })
    }));
    expect(mockCloudWatchEvents).toHaveBeenNthCalledWith(2, expect.objectContaining({
      "ScheduleExpression": "cron(30 12 28 02 ? 2018)"
    }));
    delete config.scheduleStep;
  });

  it('should return "SUCCESS" when "getCFUrl" returns a URL', async () => {
    mockCloudFormation.mockImplementation(() => {
      return {
        promise() {
          // scan
          return Promise.resolve(getStackExports);
        }
      };
    });

    const response = await lambda.getCFUrl();
    expect(response).toEqual('https://s3-test-url/prefix/regional.template');
  });

  //Negative Tests
  it('should return "DB ERROR" when "LISTTESTS" fails', async () => {
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // scan
          return Promise.reject('DB ERROR');
        }
      };
    });

    try {
      await lambda.listTests();
    } catch (error) {
      expect(error).toEqual('DB ERROR');
    }
  });

  it('should return "DB ERROR" when "GETTEST" fails', async () => {
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // get
          return Promise.reject('DB ERROR');
        }
      };
    });

    try {
      await lambda.getTest(testId);
    } catch (error) {
      expect(error).toEqual('DB ERROR');
    }
  });

  it('should return "DB ERROR" when "DELETETEST" fails', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // delete
          return Promise.reject('DB ERROR');
        }
      };
    });
    mockCloudWatchLogs.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockCloudWatch.mockImplementationOnce(() => {
      return {
        promise() {
          //delete dashboard
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockCloudWatchEvents.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });

    try {
      await lambda.deleteTest(testId, context.functionName);
    } catch (error) {
      expect(error).toEqual('DB ERROR');
    }
  });

  it('should return "DB ERROR" when "DELETETEST" fails when deleting the test', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchLogs.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockCloudWatch.mockImplementationOnce(() => {
      return {
        promise() {
          //delete dashboard
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          return Promise.reject('DDB ERROR - DELETE FAILED');
        }
      };
    });

    try {
      await lambda.deleteTest(testId, context.functionName);
    } catch (error) {
      expect(error).toEqual('DDB ERROR - DELETE FAILED');
    }
  });

  it('should return "METRICS ERROR" when "DELETETEST" fails due to deleteMetricFilter error other than ResourceNotFoundException', async () => {
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getData);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // delete
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchLogs.mockImplementationOnce(() => {
      return {
        promise() {
          //delete metrics
          return Promise.reject("METRICS ERROR");
        }
      };
    });
    mockCloudWatch.mockImplementationOnce(() => {
      return {
        promise() {
          //delete dashboard
          return Promise.resolve();
        }
      };
    });
    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve(rulesResponse);
        }
      };
    });
    mockCloudWatchEvents.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve();
        }
      };
    });

    try {
      await lambda.deleteTest(testId, context.functionName);
    } catch (error) {
      expect(error).toEqual('METRICS ERROR');
    }
  });

  it('should return "STEP FUNCTIONS ERROR" when "CREATETEST" fails', async () => {
    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf);
        }
      };
    });
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getRegionalConf2);
        }
      };
    });
    mockStepFunctions.mockImplementation(() => {
      return {
        promise() {
          // startExecution
          return Promise.reject('STEP FUNCTIONS ERROR');
        }
      };
    });

    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error).toEqual('STEP FUNCTIONS ERROR');
    }
  });

  it('should return "DB ERROR" when "CREATETEST" fails', async () => {
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // update
          return Promise.reject('DB ERROR');
        }
      };
    });
    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });
    mockStepFunctions.mockImplementation(() => {
      return {
        promise() {
          // startExecution
          return Promise.resolve();
        }
      };
    });

    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error).toEqual('DB ERROR');
    }
  });

  it('should return "InvalidParameter" when "CREATETEST" fails due to task count being less than 1', async () => {
    config.testTaskConfigs[0]["taskCount"] = "0";
    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error.code).toEqual('InvalidParameter');
    }

    //reset config
    config.testTaskConfigs[0]["taskCount"] = "5";
  });

  it('should return "InvalidParameter" when "CREATETEST" fails due to concurrency being less 1', async () => {
    config.testTaskConfigs[0]["concurrency"] = 0;
    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error.code).toEqual('InvalidParameter');
    }
    //reset config
    config.testTaskConfigs[0]["concurrency"] = "5";
  });

  it('should return "InvalidParameter" when "CREATETEST" fails due to hold-for less than min with no units', async () => {
    config.testScenario.execution[0]["hold-for"] = 0;

    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error.code).toEqual('InvalidParameter');
    }
    //reset config
    config.testScenario.execution[0]["hold-for"] = "1m";
  });

  it('should return "InvalidParameter" when "CREATETEST" fails due to hold-for less than min with units', async () => {
    config.testScenario.execution[0]["hold-for"] = "0 ms";

    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error.code).toEqual('InvalidParameter');
    }

    //reset config
    config.testScenario.execution[0]["hold-for"] = "1m";
  });

  it('should return "InvalidParameter" when "CREATETEST" fails due to hold-for units being invalid', async () => {
    config.testScenario.execution[0]["hold-for"] = "2 seconds";

    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error.code).toEqual('InvalidParameter');
    }
    //reset config
    config.testScenario.execution[0]["hold-for"] = "1m";
  });

  it('should return "InvalidParameter" when "CREATETEST" fails due to hold-for being invalid', async () => {
    config.testScenario.execution[0]["hold-for"] = "a";
    config.testType = "simple";

    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error.code).toEqual('InvalidParameter');
    }
    //reset config
    config.testScenario.execution[0]["hold-for"] = "1m";
    delete config.testType;
  });

  it('should return "InvalidParameter" when "CREATETEST" fails due to recurrence being invalid', async () => {
    config.recurrence = "invalid";

    try {
      await lambda.createTest(config);
    } catch (error) {
      expect(error.code).toEqual('InvalidParameter');
    }
    //reset config
    delete config.recurrence;
  });

  it('should return an exception when "CreateTest" fails to return a regional config', async () => {
    mockS3.mockImplementation(() => {
      return {
        promise() {
          // putObject
          return Promise.resolve();
        }
      };
    });

    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(notRegionalConf);
        }
      };
    });
    await lambda.createTest(config).catch(err => {
      expect(err.message.toString()).toEqual("The region requested does not have a stored infrastructure configuration.");
    });
  });

  it('should return InvalidParameter when "SCHEDULETEST" fails due to invalid recurrence', async () => {
    config.scheduleStep = 'start';
    config.recurrence = 'invalid';
    eventInput = { body: JSON.stringify(config) };

    mockCloudWatchEvents.mockImplementationOnce(() => {
      return {
        promise() {
          //listRule
          return Promise.resolve({ Rules: [] });
        }
      };
    });

    try {
      await lambda.scheduleTest(eventInput, context);
    } catch (error) {
      expect(error.code).toEqual("InvalidParameter");
    }
    //reset config
    delete config.recurrence;
    delete config.scheduleStep;
  });

  it('should return "DB ERROR" when CANCELTEST fails', async () => {
    mockLambda.mockImplementationOnce(() => {
      return {
        promise() {
          //invoke TaskCanceler lambda function
          return Promise.resolve();
        }
      };
    });
    mockDynamoDB.mockImplementation(() => {
      return {
        promise() {
          // update
          return Promise.reject('DB ERROR');
        }
      };
    });

    try {
      await lambda.cancelTest(testId);
    } catch (error) {
      expect(error).toEqual("DB ERROR");
    }
  });

  it('should return "ECS ERROR" when listTasks fails', async () => {
    mockAWS.ECS = jest.fn(() => ({
      listTasks: mockEcs
    }));
    mockDynamoDB.mockImplementationOnce(() => {
      return {
        promise() {
          // get
          return Promise.resolve(getAllRegionalConfs);
        }
      };
    });
    mockEcs.mockImplementationOnce(() => {
      return {
        promise() {
          //describeTasks
          return Promise.reject("ECS ERROR");
        }
      };
    });

    try {
      await lambda.listTasks();
    } catch (error) {
      expect(error).toEqual("ECS ERROR");
    }
  });
});

it('should return "DDB ERROR" when listTasks fails', async () => {
  mockAWS.ECS = jest.fn(() => ({
    listTasks: mockEcs
  }));
  mockDynamoDB.mockImplementationOnce(() => {
    return {
      promise() {
        // get
        return Promise.reject("DDB ERROR");
      }
    };
  });

  try {
    await lambda.listTasks();
  } catch (error) {
    expect(error).toEqual("DDB ERROR");
  }
});

it('should return "DDB ERROR" when retrieveTestEntry fails', async () => {
  mockDynamoDB.mockImplementationOnce(() => {
    return {
      promise() {
        // get
        return Promise.reject('DDB ERROR');
      }
    };
  });

  try {
    await lambda.getTest(testId);
  } catch (error) {
    expect(error).toEqual("DDB ERROR");
  }
});

it('should return "DDB ERROR" when retrieveTestRegionConfigs fails', async () => {
  mockDynamoDB.mockImplementationOnce(() => {
    return {
      promise() {
        // update
        return Promise.reject('DDB ERROR');
      }
    };
  });

  try {
    await lambda.getTest(testId);
  } catch (error) {
    expect(error).toEqual("DDB ERROR");
  }
});

it('should return "InvalidConfiguration" when no testTaskConfigs are returned', async () => {
  mockDynamoDB.mockImplementationOnce(() => {
    return {
      promise() {
        // get
        return Promise.resolve(getDataWithNoConfigs);
      }
    };
  });

  try {
    await lambda.getTest(testId);
  } catch (error) {
    expect(error.code).toEqual("InvalidConfiguration");
  }
});

it('should return "InvalidInfrastructureConfiguration" when an empty testTaskConfigs are returned', async () => {
  mockDynamoDB.mockImplementation(() => {
    return {
      promise() {
        // get
        return Promise.resolve(getDataWithEmptyConfigs);
      }
    };
  });

  try {
    await lambda.getTest(testId);
  } catch (error) {
    expect(error.code).toEqual("InvalidInfrastructureConfiguration");
  }
});

it('should return an error when no exports returned', async () => {
  mockCloudFormation.mockImplementation(() => {
    return {
      promise() {
        return Promise.resolve(errorNoStackExports);
      }
    };
  });

  await lambda.getCFUrl(testId).catch(err => {
    expect(err.toString()).toContain("TypeError");
    expect(err.toString()).toContain("Value");
  });
});

it('should return "S3 ERROR" when "PUTOBJECT" fails', async () => {
  mockS3.mockImplementation(() => {
    return {
      promise() {
        // putObject
        return Promise.reject('S3 ERROR');
      }
    };
  });

  try {
    await lambda.createTest(config);
  } catch (error) {
    expect(error).toEqual("S3 ERROR");
  }
});