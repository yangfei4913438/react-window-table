import Table from 'src/components/Table';

const App = () => {
  return (
    <div className={'mx-8'}>
      <Table
        canDragSortRow={true}
        canChecked={true}
        canResize={true}
        canDragOrder={true}
        canFilter={true}
        canSort={true}
        fixedLeftCount={1}
        fixedRightCount={1}
        fixedTopCount={1}
        multiTitle={false}
        showEmpty={false}
        showScrolling={false}
      />
    </div>
  );
};

export default App;
