import { Mock, Times } from 'tsmockit';
import { Queryable, Repository, Strings } from 'tsbase';
import { ConfigureOperation, IInquirer } from '../configure';

describe('ConfigureOperation', () => {
  let classUnderTest: ConfigureOperation;
  const mockRepository = new Mock<Repository<Record<string, string>>>();
  const mockInquirer = new Mock<IInquirer>();

  beforeEach(() => {
    mockInquirer.Setup(i => i.prompt([]), {
      baseUrl: 'fake.com'
    } as Record<string, string>);

    mockRepository.Setup(r => r.find(() => true), null);
    mockRepository.Setup(r => r.push({ key: Strings.Empty, value: Strings.Empty }));
    mockRepository.Setup(r => r.indexOf({}, 0));
    mockRepository.Setup(r => r.SaveChanges());
    mockRepository.Setup(r => r.splice(0, 1));

    classUnderTest = new ConfigureOperation(mockRepository.Object, mockInquirer.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return a successful result after executing when a previously UNSET setting is SET', async () => {
    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeTruthy();
    mockRepository.Verify(r => r.find(() => true), Times.Once);
    mockRepository.Verify(r => r.push({ key: Strings.Empty, value: Strings.Empty }), Times.Once);
    mockRepository.Verify(r => r.SaveChanges(), Times.Once);
  });

  it('should return a successful result after executing when a previously SET setting is SET', async () => {
    mockRepository.Setup(r => r.find(s => s.key === 'baseUrl'), { key: 'baseUrl', value: 'localhost' });

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeTruthy();
    mockRepository.Verify(r => r.find(() => true), Times.Once);
    mockRepository.Verify(r => r.SaveChanges(), Times.Once);
    mockRepository.Verify(r => r.push({ key: Strings.Empty, value: Strings.Empty }), Times.Never);
  });

  it('should return a successful result after executing when a previously SET setting is UNSET', async () => {
    mockInquirer.Setup(i => i.prompt([]), {
      baseUrl: ''
    } as Record<string, string>);
    mockRepository.Setup(r => r.find(s => s.key === 'baseUrl'), { key: 'baseUrl', value: 'localhost' });

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeTruthy();
    mockRepository.Verify(r => r.find(s => s.key === 'baseUrl'), Times.Once);
    mockRepository.Verify(r => r.SaveChanges(), Times.Once);
    mockRepository.Verify(r => r.push({ key: Strings.Empty, value: Strings.Empty }), Times.Never);
  });

  it('should return a successful result after executing when a previously UNSET setting is UNSET', async () => {
    mockInquirer.Setup(i => i.prompt([]), {
      baseUrl: ''
    } as Record<string, string>);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeTruthy();
    mockRepository.Verify(r => r.find(() => true), Times.Once);
    mockRepository.Verify(r => r.SaveChanges(), Times.Once);
    mockRepository.Verify(r => r.push({ key: Strings.Empty, value: Strings.Empty }), Times.Never);
  });

  it('should find a repository entry with a given key, and return a failing result on error', async () => {
    const fakeRepository = Queryable.From([]); // will throw an error on "SaveChanges()"
    fakeRepository.push({ key: 'baseUrl', value: 'test' });
    classUnderTest = new ConfigureOperation(fakeRepository as Repository<Record<string, string>>, mockInquirer.Object);

    const result = await classUnderTest.Execute();

    expect(result.IsSuccess).toBeFalsy();
  });
});
