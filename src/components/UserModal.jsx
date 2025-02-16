import React, { useState } from "react";
import { 
  X, Mail, Phone, AlertTriangle, Shield, User, Calendar, Briefcase, MapPin, 
  Clock, FileText, Settings, CheckCircle, XCircle, AlertOctagon, Globe, Heart, 
  Book, DollarSign, Eye, Flag, MessageCircle, Download, ExternalLink, Ruler,
  Building, GraduationCap, Home, School, Droplets,
  UserCircleIcon
} from "lucide-react";

const UserModal = ({ user, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!user) return null;

  const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-6 last:mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-200">
        <Icon className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-700 text-lg">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">{children}</div>
    </div>
  );

        const Field = ({ label, value, warning, icon: Icon, link }) => (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors border border-green-200">
        <Icon className="w-5 h-5 text-gray-500 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-500">{label}</div>
          <div className={`font-medium truncate ${warning ? 'text-red-600' : 'text-green-700'}`}>
            {typeof value === 'boolean' ? (
              <span className="flex items-center gap-1">
                {value ? (
                  warning ? (
                    <>
                      <AlertOctagon className="w-4 h-4 text-red-500" />
                      <span>Yes</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Yes</span>
                    </>
                  )
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span>No</span>
                  </>
                )}
              </span>
            ) : (
              link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {value}
                </a>
              ) : (
                value || "N/A"
              )
            )}
          </div>
        </div>
      </div>
    );

  const ImageViewer = ({ url, title, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <img src={url} alt={title} className="w-full h-auto max-h-[70vh] object-contain" />
        <div className="mt-4 flex justify-end gap-2">
          <a
            href={url}
            download
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  );

  const AadhaarCard = ({ images }) => (
    <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {['front', 'back'].map((side) => (
        <div key={side} className="border rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2 capitalize">{side} Side</h4>
          {images?.[side] ? (
            <div className="relative group">
              <img
                src={images[side]}
                alt={`Aadhaar ${side}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImage({ url: images[side], title: `Aadhaar ${side} Side` })}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImage({ url: images[side], title: `Aadhaar ${side} Side` })}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-700" />
                  </button>
                  <a
                    href={images[side]}
                    download
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-5 h-5 text-gray-700" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const UserPhotos = ({ photos }) => (
    <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {photos.slice(1).map((photo, index) => (
        <div key={index} className="border rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Photo {index + 1}</h4>
          {photo ? (
            <div className="relative group">
              <img
                src={photo}
                alt={`User Photo ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImage({ url: photo, title: `User Photo ${index + 1}` })}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImage({ url: photo, title: `User Photo ${index + 1}` })}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-700" />
                  </button>
                  <a
                    href={photo}
                    download
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-5 h-5 text-gray-700" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden my-4">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-200 shadow-sm z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.photos?.[0] || user.photoURL || "/default-avatar.png"}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              {user.verifiedByAdmin && (
                <CheckCircle className="w-5 h-5 text-blue-500 absolute -right-1 -bottom-1 bg-white rounded-full" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name || "No Name"}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Briefcase className="w-4 h-4" />
                <span>{user.role || "User"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="pb-16 p-6 overflow-y-auto max-h-[calc(95vh-140px)] space-y-6">
          <Section title="Contact Information" icon={Mail}>
            <Field label="Email" value={user.email} icon={Mail} link={`mailto:${user.email}`} />
            <Field 
              label="Phone" 
              value={user.phone} 
              icon={Phone} 
              link={`tel:${user.phone}`} 
            />
            <Field 
              label="WhatsApp" 
              value={user.phone} 
              icon={MessageCircle} 
              link={`https://wa.me/${user.phone}`} 
            />
          </Section>

          <Section title="Personal Information" icon={User}>
            <Field label="Date of Birth" value={user.dateOfBirth} icon={Calendar} />
            <Field label="Age" value={user.age} icon={Calendar} />
            <Field label="Gender" value={user.sex} icon={User} />
            <Field label="Height" value={`${user.heightFeet} ft ${user.heightInches} in`} icon={Ruler} />
            <Field label="Blood Group" value={user.bloodGroup} icon={Droplets} />
            <Field label="Complexion" value={user.complexion} icon={User} />
            <Field label="Mother Tongue" value={user.motherTongue} icon={MessageCircle} />
            {/* <Field label="Religion" value={user.religion} icon={Heart} /> */}
            <Field label="Caste" value={user.caste} icon={User} />
            <Field label="Sub Caste" value={user.subCaste} icon={User} />
            <Field label="Manglik Status" value={user.manglic} icon={Heart} />
            <Field label="Marital Status" value={user.status} icon={UserCircleIcon} />
          </Section>

          <Section title="User Photos" icon={User}>
            {user.photos && user.photos.length > 1 ? (
              <UserPhotos photos={user.photos} />
            ) : (
              <div className="text-gray-500">There are no additional pictures other than the display image.</div>
            )}
          </Section>

          <Section title="Location Details" icon={MapPin}>
            <Field label="Region" value={user.region} icon={MapPin} />
            <Field label="State" value={user.state} icon={MapPin} />
            <Field label="District" value={user.district} icon={MapPin} />
            <Field label="Pincode" value={user.pincode} icon={MapPin} />
            <Field label="Specific Address" value={user.specificAddress} icon={Home} />
          </Section>

          <Section title="Professional Details" icon={Briefcase}>
            <Field label="Profession" value={user.profession} icon={Briefcase} />
            <Field label="Organization" value={user.organization} icon={Building} />
            <Field label="Employment Status" value={user.employmentStatus} icon={Briefcase} />
            <Field label="Salary" value={user.hideSalary ? "Hidden" : user.salary} icon={DollarSign} />
            <Field label="Work Address" value={user.workAddress} icon={Building} />
            {/* <Field label="Agent Ref Code" value={user.agentRefCode} icon={FileText} /> */}
          </Section>

          <Section title="Education" icon={GraduationCap}>
            <Field label="Highest Qualification" value={user.highestQualification} icon={GraduationCap} />
            {/* <Field label="Post Graduate" value={user.postGraduate} icon={GraduationCap} />
            <Field label="12th Pass" value={user.twelfthPass} icon={School} />
            <Field label="10th Pass" value={user.tenthPass} icon={School} /> */}
          </Section>

          <Section title="Aadhaar Details" icon={Shield}>
            <Field label="Aadhaar Number" value={user.aadhaarNumber} icon={FileText} />
            {/* <Field label="Verified" value={user.adharVarified} icon={Shield} /> */}
            <AadhaarCard images={user.aadhaarImages} />
          </Section>

          <Section title="Account Status" icon={Shield}>
            <Field label="Verified by Admin" value={user.verifiedByAdmin} icon={Shield} />
            <Field 
              label="Account Status" 
              value={user.reported ? "Reported" : "Fine"} 
              icon={Settings} 
              warning={user.reported}
            />
            <Field label="Payment Done" value={user.payment} icon={DollarSign} />
            <Field label="Payment Type" value={user.paymentType} icon={DollarSign} />
          </Section>

          <Section title="Safety Flags" icon={AlertTriangle}>
            {Array.isArray(user.reportReason) && user.reportReason.includes('fakeProfile') && (
              <Field label="Fake Profile" value={true} warning icon={AlertTriangle} />
            )}
            {Array.isArray(user.reportReason) && user.reportReason.includes('harassment') && (
              <Field label="Harassment Report" value={true} warning icon={Flag} />
            )}
            {Array.isArray(user.reportReason) && user.reportReason.includes('inappropriateContent') && (
              <Field label="Inappropriate Content" value={true} warning icon={AlertOctagon} />
            )}
            {Array.isArray(user.reportReason) && user.reportReason.includes('spam') && (
              <Field label="Spam" value={true} warning icon={AlertTriangle} />
            )}
            <Field label="Reported" value={user.reported} warning={user.reported} icon={Flag} />
          </Section>

          <Section title="Additional Information" icon={FileText}>
            <div className="col-span-2">
              {/* <Field label="Description" value={user.description} icon={FileText} /> */}
            </div>
            <Field 
              label="Created At" 
              value={user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleString() : "N/A"}
              icon={Clock}
            />
            <Field 
              label="Updated At" 
              value={user.updatedAt ? new Date(user.updatedAt.seconds * 1000).toLocaleString() : "N/A"}
              icon={Clock}
            />
            <Field label="UID" value={user.uid} icon={User} />
          </Section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 shadow-sm flex justify-center">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        {/* Image Viewer Modal */}
        {selectedImage && (
          <ImageViewer
            url={selectedImage.url}
            title={selectedImage.title}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default UserModal;