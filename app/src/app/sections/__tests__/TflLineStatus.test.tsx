import { render, screen, waitFor } from "@testing-library/react";
import TflLineStatus from "../TfL/TflLineStatus";
import { useFetch } from "../../hooks/useFetch";

jest.mock("../../hooks/useFetch");
const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch>;

afterEach(() => {
  jest.clearAllMocks();
});

describe("TflLineStatus", () => {
  it("renders with mocked API data", async () => {
    const dummyData = [
      { name: "Victoria", status: "Good Service", statusSeverity: 10 },
      { name: "Northern", status: "Minor Delays", statusSeverity: 5 },
      { name: "Central", status: "Part Suspended", statusSeverity: 3 },
    ];

    mockUseFetch.mockReturnValue({
      data: dummyData,
      loading: false,
      error: null,
    });

    render(<TflLineStatus />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /TFL Line Status/ }),
      ).toBeInTheDocument();

      expect(screen.getByRole("list")).toBeInTheDocument();

      expect(screen.getByLabelText("Line name Victoria")).toHaveTextContent(
        "Victoria",
      );
      expect(
        screen.getByLabelText("Line status Good Service"),
      ).toHaveTextContent("Good Service");

      expect(screen.getByLabelText("Line name Northern")).toHaveTextContent(
        "Northern",
      );
      expect(
        screen.getByLabelText("Line status Minor Delays"),
      ).toHaveTextContent("Minor Delays");

      expect(screen.getByLabelText("Line name Central")).toHaveTextContent(
        "Central",
      );
      expect(
        screen.getByLabelText("Line status Part Suspended"),
      ).toHaveTextContent("Part Suspended");
    });
  });
  it("renders error message from thrown Error", async () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Something went wrong",
    });
    render(<TflLineStatus />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Something went wrong",
      );
    });
  });

  it("renders 'Unknown error' for non-Error thrown values", async () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Unknown error",
    });
    render(<TflLineStatus />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Unknown error");
    });
  });
  it("renders error message from not ok response", async () => {
    mockUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to fetch TFL line statuses: 404",
    });
    render(<TflLineStatus />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to fetch TFL line statuses: 404",
      );
    });
  });
});
