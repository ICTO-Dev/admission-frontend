import React, { useState, useEffect } from "react";
import { MapPin, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { useRegions, useProvinces, useMunicipalities, useBarangays } from "../../hooks/useGeo.js";

/**
 * AddressSelector component for Philippine Geo Location
 * Cascading: Region -> Province -> Municipality / City -> Barangay
 */
export default function AddressSelector({
  title = "Address",
  required = false,
  value = "",
  onChange,
  showSameAsCheckbox = false,
  isSameAsPresent = false,
  onToggleSameAs,
  sameAsLabel = "Same as Present Address",
  syncedAddress = "",
}) {
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState("");
  const [selectedBarangayId, setSelectedBarangayId] = useState("");
  const [street, setStreet] = useState("");

  // TanStack queries
  const { data: regions = [], isLoading: isLoadingRegions } = useRegions();
  const { data: provinces = [], isLoading: isLoadingProvinces } = useProvinces(selectedRegionId);
  const { data: municipalities = [], isLoading: isLoadingMunicipalities } = useMunicipalities(selectedProvinceId);
  const { data: barangays = [], isLoading: isLoadingBarangays } = useBarangays(selectedMunicipalityId);

  // Handle Region Change
  const handleRegionChange = (e) => {
    const rId = e.target.value;
    setSelectedRegionId(rId);
    setSelectedProvinceId("");
    setSelectedMunicipalityId("");
    setSelectedBarangayId("");
    triggerChange(rId, "", "", "", street);
  };

  // Handle Province Change
  const handleProvinceChange = (e) => {
    const pId = e.target.value;
    setSelectedProvinceId(pId);
    setSelectedMunicipalityId("");
    setSelectedBarangayId("");
    triggerChange(selectedRegionId, pId, "", "", street);
  };

  // Handle Municipality Change
  const handleMunicipalityChange = (e) => {
    const mId = e.target.value;
    setSelectedMunicipalityId(mId);
    setSelectedBarangayId("");
    triggerChange(selectedRegionId, selectedProvinceId, mId, "", street);
  };

  // Handle Barangay Change
  const handleBarangayChange = (e) => {
    const bId = e.target.value;
    setSelectedBarangayId(bId);
    triggerChange(selectedRegionId, selectedProvinceId, selectedMunicipalityId, bId, street);
  };

  // Handle Street / House change
  const handleStreetChange = (e) => {
    const sVal = e.target.value;
    setStreet(sVal);
    triggerChange(selectedRegionId, selectedProvinceId, selectedMunicipalityId, selectedBarangayId, sVal);
  };

  // Compose formatted string
  const triggerChange = (rId, pId, mId, bId, sVal) => {
    if (!onChange) return;

    const rObj = regions.find((r) => String(r.id) === String(rId));
    const pObj = provinces.find((p) => String(p.id) === String(pId));
    const mObj = municipalities.find((m) => String(m.id) === String(mId));
    const bObj = barangays.find((b) => String(b.id) === String(bId));

    const parts = [];
    if (sVal && sVal.trim()) parts.push(sVal.trim());
    if (bObj && bObj.name) parts.push(bObj.name);
    if (mObj && mObj.name) parts.push(mObj.name);
    if (pObj && pObj.name) parts.push(pObj.name);
    if (rObj && rObj.name) parts.push(rObj.name);

    const formattedAddress = parts.join(", ");

    onChange(formattedAddress, {
      region: rObj || null,
      province: pObj || null,
      municipality: mObj || null,
      barangay: bObj || null,
      street: sVal || "",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3 transition-all hover:border-emerald-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-emerald-700 shrink-0" />
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
            {title} {required && <span className="text-red-500">*</span>}
          </span>
        </div>

        {showSameAsCheckbox && (
          <label className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 cursor-pointer select-none hover:bg-emerald-100 transition-colors">
            <input
              type="checkbox"
              checked={isSameAsPresent}
              onChange={(e) => onToggleSameAs && onToggleSameAs(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-emerald-700 w-3.5 h-3.5"
            />
            <span>{sameAsLabel}</span>
          </label>
        )}
      </div>

      {isSameAsPresent ? (
        <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-lg flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-700 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-emerald-900">
              Copied from Present Address
            </div>
            <div className="text-xs text-gray-700 font-medium mt-0.5 break-words">
              {syncedAddress || <span className="italic text-gray-400">No present address selected yet</span>}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Cascading Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Region */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
                Region {isLoadingRegions && <Loader2 size={11} className="inline animate-spin text-emerald-700 ml-1" />}
              </label>
              <select
                value={selectedRegionId}
                onChange={handleRegionChange}
                disabled={isLoadingRegions}
                className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all disabled:opacity-50"
              >
                <option value="">-- Select Region --</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
                Province {isLoadingProvinces && <Loader2 size={11} className="inline animate-spin text-emerald-700 ml-1" />}
              </label>
              <select
                value={selectedProvinceId}
                onChange={handleProvinceChange}
                disabled={!selectedRegionId || isLoadingProvinces}
                className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all disabled:opacity-50 disabled:bg-gray-100"
              >
                <option value="">
                  {!selectedRegionId ? "-- Select Region First --" : "-- Select Province --"}
                </option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipality / City */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
                Municipality / City {isLoadingMunicipalities && <Loader2 size={11} className="inline animate-spin text-emerald-700 ml-1" />}
              </label>
              <select
                value={selectedMunicipalityId}
                onChange={handleMunicipalityChange}
                disabled={!selectedProvinceId || isLoadingMunicipalities}
                className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all disabled:opacity-50 disabled:bg-gray-100"
              >
                <option value="">
                  {!selectedProvinceId ? "-- Select Province First --" : "-- Select Municipality / City --"}
                </option>
                {municipalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Barangay */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
                Barangay {isLoadingBarangays && <Loader2 size={11} className="inline animate-spin text-emerald-700 ml-1" />}
              </label>
              <select
                value={selectedBarangayId}
                onChange={handleBarangayChange}
                disabled={!selectedMunicipalityId || isLoadingBarangays}
                className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all disabled:opacity-50 disabled:bg-gray-100"
              >
                <option value="">
                  {!selectedMunicipalityId ? "-- Select Municipality First --" : "-- Select Barangay --"}
                </option>
                {barangays.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Street / House No / Subdivision / Zone */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">
              House No. / Street / Subdivision / Zone <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Zone 3, Purok 2, or Block 5 Lot 12"
              value={street}
              onChange={handleStreetChange}
              className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
            />
          </div>

          {/* Formatted Address Preview */}
          {value && (
            <div className="pt-1.5 flex items-start gap-1.5 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
              <span className="font-semibold text-emerald-800 shrink-0">Selected Address:</span>
              <span className="font-medium text-gray-900 break-words">{value}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
