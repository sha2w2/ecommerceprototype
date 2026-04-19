import { useState } from 'react';
import { Mail, Phone, MapPin, Lock } from 'lucide-react';

export function MyAccountPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#0a0a0a', marginBottom: 24 }}>
        Personal Information
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', marginBottom: 40, lineHeight: 1.6 }}>
        Manage your personal details, secure your account, and update contact information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <div className="p-6 bg-[#fafafa] rounded-sm" style={{ border: '1px solid #e4e4e4' }}>
          <div className="flex justify-between items-start mb-6">
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>Profile</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-[#0a0a0a] underline text-sm hover:text-[#3a3a3a]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', display: 'block', marginBottom: 4 }}>Full Name</label>
              {isEditing ? (
                <input type="text" defaultValue="User X" className="w-full px-3 py-2 border border-[#e4e4e4] rounded-sm bg-white" />
              ) : (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a' }}>User X</p>
              )}
            </div>
            
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', display: 'block', marginBottom: 4 }}>Email Address</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#a0a0a0]" />
                {isEditing ? (
                  <input type="email" defaultValue="userx@example.com" className="w-full px-3 py-2 border border-[#e4e4e4] rounded-sm bg-white" />
                ) : (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a' }}>userx@example.com</p>
                )}
              </div>
            </div>

            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', display: 'block', marginBottom: 4 }}>Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#a0a0a0]" />
                {isEditing ? (
                  <input type="tel" defaultValue="+370 612 34567" className="w-full px-3 py-2 border border-[#e4e4e4] rounded-sm bg-white" />
                ) : (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a' }}>+370 612 34567</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="p-6 bg-[#fafafa] rounded-sm" style={{ border: '1px solid #e4e4e4' }}>
          <div className="flex justify-between items-start mb-6">
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>Shipping Address</h3>
            <button 
              className="text-[#0a0a0a] underline text-sm hover:text-[#3a3a3a]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Manage
            </button>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#a0a0a0] mt-1" />
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a', fontWeight: 500, marginBottom: 4 }}>Home</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', lineHeight: 1.5 }}>
                Gedimino pr. 1<br />
                01103 Vilnius<br />
                Lithuania
              </p>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="p-6 bg-[#fafafa] rounded-sm" style={{ border: '1px solid #e4e4e4' }}>
          <div className="flex justify-between items-start mb-6">
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#0a0a0a' }}>Security</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#a0a0a0]" />
            <div className="flex-1">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0a0a0a', fontWeight: 500, marginBottom: 4 }}>Password</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b' }}>Last updated 3 months ago</p>
            </div>
            <button className="px-4 py-2 border border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors rounded-sm text-xs font-medium">
              Update
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
