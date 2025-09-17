import SinglePage from "@/components/JobDetials/JobDetails";

const WorkplaceDetialPage = ({ params }) => {
  console.log(params);
  return (
    <div>
      <SinglePage jobId={params.id} />
    </div>
  );
};

export default WorkplaceDetialPage;
