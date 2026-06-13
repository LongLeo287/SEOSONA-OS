import type { AttioStatus } from "./attio"

export function mapDeelToAttioStatus(deelStatus: string): AttioStatus {
  switch (deelStatus) {
    case "draft":
      return "Applied"
    case "sent":
    case "signed_by_contractor":
      return "Contract Sent"
    case "signed_by_client":
    case "active":
      return "Active"
    case "terminated":
      return "Archived"
    default:
      return "Applied"
  }
}
