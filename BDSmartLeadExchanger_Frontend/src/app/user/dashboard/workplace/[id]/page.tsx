import SinglePage from "@/components/JobDetials/JobDetails";

const WorkplaceDetialPage = async ({ params }) => {
  const resolvedParams = await params;
  return (
    <div>
      <SinglePage jobId={resolvedParams.id} />
    </div>
  );
};

export default WorkplaceDetialPage;
