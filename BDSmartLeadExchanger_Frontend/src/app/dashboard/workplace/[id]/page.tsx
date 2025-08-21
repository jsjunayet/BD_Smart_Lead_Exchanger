import JobDetail from "@/components/JobDetials/JobDetails";

const WorkplaceJobDetials = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <JobDetail id={id} />
    </div>
  );
};

export default WorkplaceJobDetials;
