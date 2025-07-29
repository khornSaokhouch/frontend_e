"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../store/userStore";
import { motion } from "framer-motion";
import Image from "next/image";
import { UserCircle, Mail, ShieldCheck, PackageCheck } from "lucide-react";

const CompanyListPage = () => {
  const router = useRouter();
  const { user, fetchUser, users, fetchAllUsers, loading, error } =
    useUserStore();

  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function init() {
      const currentUser = await fetchUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      if (currentUser.role === "admin") {
        setAuthorized(true);
        await fetchAllUsers();
      } else {
        setAuthorized(false);
      }

      setCheckingAuth(false);
    }
    init();
  }, [fetchUser, fetchAllUsers, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (checkingAuth || loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-indigo-600 font-medium animate-pulse">Loading companies...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-red-600 font-semibold">
          Access Denied: You do not have permission to view this page.
        </div>
      </div>
    );
  }

  const companies = users.filter((u) => u.role === "company");

  return (
    <motion.div
      className="container mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.h1
        className="text-3xl font-semibold text-gray-900"
        variants={itemVariants}
      >
        Companies List
      </motion.h1>

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
          variants={itemVariants}
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </motion.div>
      )}

      {/* No Companies Found */}
      {companies.length === 0 && !error && (
        <motion.div
          className="text-gray-500 italic p-4 rounded-md bg-gray-50"
          variants={itemVariants}
        >
          No companies found.
        </motion.div>
      )}

      {/* Table */}
      {companies.length > 0 && (
        <motion.div
          className="bg-white rounded-lg shadow-md"
          variants={itemVariants}
        >
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>{/* Reduced px value */}
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>{/* Reduced px value */}
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>{/* Reduced px value */}
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>{/* Reduced px value */}
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>{/* Reduced px value */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company, index) => (
                <motion.tr
                  key={company.id}
                  className="hover:bg-gray-100 transition-colors"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <td className="px-2 py-4 break-words">{index + 1}</td>{/* Reduced px value */}
                  <td className="px-2 py-4 break-words">{/* Reduced px value */}
                    <div className="flex items-center">
                      <div className="h-10 w-10 relative rounded-full overflow-hidden">
                        {company.profile_image_url ? (
                          <Image
                            src={company.profile_image_url}
                            alt={company.name || "Company Logo"}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="40px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      </div>
                  </td>
                  <td className="px-2 py-4 break-words font-medium text-gray-800">{company.name}</td>{/* Reduced px value */}
                  <td className="px-2 py-4 break-words text-gray-700">{company.email}</td>{/* Reduced px value */}
                  <td className="px-2 py-4 break-words capitalize text-gray-700">{company.role}</td>{/* Reduced px value */}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CompanyListPage;