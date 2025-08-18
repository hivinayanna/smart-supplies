import React from 'react';
import SideNavBar from '../../components/sideNavBar';
import HistoricoCompras from '../../components/historicoCompras';
import Footer from '../../components/footer';

const HistoricoPage = () => {
    return (
        <>
            <SideNavBar />
            <main className="historico-page">
                <HistoricoCompras />
            </main>
            <Footer />
        </>
    );
};

export default HistoricoPage;
