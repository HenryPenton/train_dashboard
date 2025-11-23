import { render, screen } from "@testing-library/react";
import JourneyMetrics from "../JourneyMetrics";

describe("JourneyMetrics", () => {
  it("renders journey metrics with proper accessibility attributes", () => {
    const testDuration = 45;
    const testArrival = "2025-11-23T14:30:00";
    const testFare = 850; // £8.50 in pence
    
    render(
      <JourneyMetrics
        duration={testDuration}
        arrival={testArrival}
        fare={testFare}
      />
    );

    // Check the main container has proper group role
    const metricsGroup = screen.getByRole("group", { name: "Journey metrics" });
    expect(metricsGroup).toBeInTheDocument();
    
    // Check duration metric
    const durationElement = screen.getByLabelText(`Journey duration: ${testDuration} minutes`);
    expect(durationElement).toBeInTheDocument();
    expect(durationElement).toHaveTextContent(`${testDuration} min`);
    
    // Check arrival time metric
    const arrivalElement = screen.getByLabelText(/Arrival time:/);
    expect(arrivalElement).toBeInTheDocument();
    expect(arrivalElement).toHaveTextContent("14:30");
    
    // Check fare metric
    const fareElement = screen.getByLabelText("Journey fare: £8.50");
    expect(fareElement).toBeInTheDocument();
    expect(fareElement).toHaveTextContent("£8.50");
  });
  
  it("renders without fare when not provided", () => {
    const testDuration = 30;
    const testArrival = "2025-11-23T09:15:00";
    
    render(
      <JourneyMetrics
        duration={testDuration}
        arrival={testArrival}
      />
    );

    // Check duration and arrival are present
    expect(screen.getByLabelText(`Journey duration: ${testDuration} minutes`)).toBeInTheDocument();
    expect(screen.getByLabelText(/Arrival time:/)).toBeInTheDocument();
    
    // Check fare is not present
    expect(screen.queryByLabelText(/Journey fare:/)).not.toBeInTheDocument();
  });
});