import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function FilterBar() {
  return (
    <div className="bg-white rounded-md p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <div className="text-sm mb-1">State</div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Rajasthan">Rajasthan</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-sm mb-1">Districts</div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Jaipur">Jaipur</SelectItem>
              <SelectItem value="Alwar">Alwar</SelectItem>
              <SelectItem value="Sikar">Sikar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-sm mb-1">Block/Taluka</div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Bassi">Bassi</SelectItem>
              <SelectItem value="Chaksu">Chaksu</SelectItem>
              <SelectItem value="Sanganer">Sanganer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-sm mb-1">PHC/CHC</div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="PHC1">PHC 1</SelectItem>
              <SelectItem value="CHC1">CHC 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-sm mb-1">Sub-health Center</div>
          <Select defaultValue="All">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="SHC1">SHC 1</SelectItem>
              <SelectItem value="SHC2">SHC 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button className="bg-primary hover:bg-primary/90 text-white">Apply</Button>
      </div>
    </div>
  )
}
