import Sidebar from '@/common/Sidebar';
import React from 'react'

const page = () => {
	return (
		<div style={{ display: 'flex' }}>
		  <Sidebar />
		  <main style={{ flex: 1, padding: '2rem' }}>Content goes here</main>
		</div>
	  );
	};

export default page