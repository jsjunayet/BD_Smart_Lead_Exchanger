import SinglePage from "@/components/JobDetials/JobDetails";

const WorkplaceDetailPage = async ({ params }: any) => {
  return (
    <div>
      <SinglePage jobId={params.id} />
    </div>
  );
};

export default WorkplaceDetailPage;
