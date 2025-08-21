import JobDetail from "@/components/JobDetials/JobDetails";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkplaceJobDetials = ({ params }: any) => {
  const { id } = params;
  return <JobDetail id={id} />;
};

export default WorkplaceJobDetials;
