// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';
import { Stack } from 'aws-cdk-lib';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { DLTAPI } from '../lib/front-end/api';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

test('DLT API Test', () => {
  const stack = new Stack();
  const testLog = new LogGroup(stack, 'TestLogGroup');
  const testPolicy = new Policy(stack, 'TestPolicy', {
    statements: [
      new PolicyStatement({
        resources: ['*'],
        actions: ['cloudwatch:Get*']
      })
    ]
  });
  const testSourceBucket = Bucket.fromBucketName(stack, 'SourceCodeBucket', 'test-bucket-region');
  const api = new DLTAPI(stack, 'TestAPI', {
    cloudWatchLogsPolicy: testPolicy,
    ecsCloudWatchLogGroup: testLog,
    historyDynamoDbPolicy: testPolicy,
    historyTable: 'testHistoryDDBTable',
    scenariosDynamoDbPolicy: testPolicy,
    taskCancelerInvokePolicy: testPolicy,
    scenariosS3Policy: testPolicy,
    scenariosBucketName: 'testScenarioBucketName',
    scenariosTableName: 'testDDBTable',
    ecsTaskExecutionRoleArn: 'arn:aws:iam::1234567890:role/MyRole-AJJHDSKSDF',
    taskRunnerStepFunctionsArn: 'arn:aws:states:us-east-1:111122223333:stateMachine:HelloWorld-StateMachine',
    taskCancelerArn: 'arn:aws:lambda:us-east-1:111122223333:function:HelloFunction',
    metricsUrl: 'http://testurl.com',
    sendAnonymousUsage: 'Yes',
    solutionId: 'testId',
    solutionVersion: 'testVersion',
    sourceCodeBucket: testSourceBucket,
    sourceCodePrefix: 'testPrefix/',
    uuid: 'abc123'
  });
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  expect(api.apiId).toBeDefined();
  expect(api.apiEndpointPath).toBeDefined();
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Description: 'API microservices for creating, updating, listing and deleting test scenarios',
    Handler: 'index.handler',
    Runtime: 'nodejs14.x',
    Environment: {
      Variables: {
        HISTORY_TABLE: "testHistoryDDBTable",
        SCENARIOS_BUCKET: 'testScenarioBucketName',
        SCENARIOS_TABLE: 'testDDBTable',
        STATE_MACHINE_ARN: 'arn:aws:states:us-east-1:111122223333:stateMachine:HelloWorld-StateMachine',
        SOLUTION_ID: 'testId',
        UUID: 'abc123',
        VERSION: 'testVersion',
        SEND_METRIC: 'Yes',
        METRIC_URL: 'http://testurl.com',
        TASK_CANCELER_ARN: 'arn:aws:lambda:us-east-1:111122223333:function:HelloFunction',
        STACK_ID: {
          "Ref": "AWS::StackId"
        }
      }
    }
  });
  expect(stack).toHaveResourceLike('AWS::ApiGateway::RequestValidator', {
    ValidateRequestBody: true,
    ValidateRequestParameters: true
  });
});
