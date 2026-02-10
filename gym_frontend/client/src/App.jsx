import React, { useEffect, useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUser] = useState([]);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const initialFormState = {
    userName: "",
    plan: "GOLD",
    weight: "",
    feesStatus: "PENDING",
  };

  const filtered = users.filter((u) =>
    u.userName.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect((e) => {
    fetchAllData();
  }, []);

  const fetchAllData = async (e) => {
    try {
      setError(false);
      const response = await fetch("/api/gym", {
        method: "GET",
      });
      const data = await response.json();
      if (data.success == false) {
        console.log(data.errMessage);
        return;
      }
      console.log(data);
      const allUsers = Array.isArray(data) ? data.flat() : data.data.flat();
      //   console.log(" data.data.flat() : ", allUsers);
      setUser(allUsers);
    } catch (err) {
      console.log(err.errMessage);
    }
  };

  // const handleSeen = async (id) => {
  //   console.log(id);
  //   // /api/gmy / 1;
  //   try {
  //     setError(false);
  //     const response = await fetch(`/api/gym/${id}`, {
  //       method: "GET",
  //     });
  //     const data = await response.json();
  //     if (data.success == false) {
  //       console.log(data.errMessage);
  //       return;
  //     }
  //     console.log(data);
  //     setFormData(data);
  //   } catch (err) {
  //     console.log(err.errMessage);
  //   }
  // };

  const handleEdit = async (user) => {
    setEditingId(user.id);
    setFormData({
      userName: user.userName,
      plan: user.plan,
      weight: user.weight,
      feesStatus: user.feesStatus,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?",
    );
    if (!confirmDelete) return;
    console.log(confirmDelete);
    try {
      const response = await fetch(`/api/gym/delete/${userId}`, {
        method: "DELETE",
      });
      const data = await response.text();
      if (data.success == false) {
        console.log(data.errMessage);
        return;
      }
      // console.log(data);
      // console.log("users : ", users);
      // console.log("editingId : ", editingId);
      setUser((prevUsers) =>
        prevUsers.filter((user) => Number(user.id) !== Number(userId)),
      );

      if (editingId === userId) {
        setEditingId(null);
        setFormData(initialFormState);
      }
      console.log(data);
    } catch (err) {
      console.log(err.errMessage);
    }

    setFormData(initialFormState);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const url = editingId ? `/api/gym/update/${editingId}` : "/api/gym/add";
  const method = editingId ? "PUT" : "POST";

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(" i am trying to submiting ");
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          plan: formData.plan,
          weight: formData.weight,
          feesStatus: formData.feesStatus,
        }),
      });

      const data = await response.json();
      if (data.success == false) {
        console.log(data.errMessage);
        setLoading(false);
        setError(data.errMessage);
        return;
      }

      if (editingId) {
        setUser((prev) => prev.map((u) => (u.id === editingId ? data : u)));
      } else {
        setUser((prev) => [...prev, data]);
      }

      setFormData(initialFormState);
      setEditingId(null);
      setLoading(false);
      // console.log([data]);
    } catch (error) {
      setLoading(false);

      console.error(error);
      setError(
        error.message || "Unable to connect to server. Please try again later.",
      );
    }
  };

  return (
    <div className=" max-w-4xl mx-auto bg-white p-6 flex flex-col items-center justify-center">
      <div className="mb-7 ">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        <h1 className="text-center my-7 font-semibold text-2xl text-slate-700 underline">
          Create Gym Records
        </h1>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              UserName
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              required
              value={formData.userName}
              onChange={handleChange}
              className="  w-[420px]  px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              placeholder="Enter your userName"
              disabled={loading}
            />
          </div>

          {/* Plan */}
          <div>
            <label
              htmlFor="plan"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              status
            </label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              disabled={loading}
            >
              <option value="-">-</option>
              <option value="GOLD">GOLD</option>
              <option value="SILVER">SILVER</option>
              <option value="BRONZE">BRONZE</option>
            </select>
          </div>

          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Weight
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              required
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              placeholder="Enter your Weight"
              disabled={loading}
            />
          </div>

          {/* Fees Status */}
          <div>
            <label
              htmlFor="feesStatus"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Fees Status
            </label>
            <select
              id="feesStatus"
              name="feesStatus"
              value={formData.feesStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              disabled={loading}
            >
              <option value="-">-</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold"
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update"
                : "Create"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-7xl bg-slate-100 rounded-xl shadow-xl p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 px-4 py-2 rounded-lg bg-white text-[16px] text-slate-700 placeholder-neutral-400  border-blue-600 outline-none  focus:outline-none border-2 "
          />
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-300 text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-left">id </th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Weight</th>
                <th className="px-4 py-3 text-left">Fees Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-300">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-100 transition">
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {user.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {user.userName}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-semibold ">
                    {user.plan}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">
                    {user.weight}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">
                    {user.feesStatus}
                  </td>
                  <td className="flex gap-3 justify-center text-center mt-3">
                    {/* <button
                      onClick={() => handleSeen(user.id)}
                      className="text-blue-500 text-mediam hover:underline hover:text-blue-400 font-medium"
                    >
                      Seen
                    </button> */}
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500  hover:underline hover:text-blue-400 font-medium"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-blue-500  hover:underline hover:text-blue-400 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination
        <div className="flex justify-end mt-4 gap-2 text-sm">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100">
            «
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100">
            »
          </button>
        </div> */}
      </div>
    </div>
  );
}
