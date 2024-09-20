const BloodInventory = ({ title, bloodInventory }) => {
    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>{title}</h2> {/* Use the title prop for the h2 element */}
            <table id="blood-inventory" className="std">
                <thead>
                <tr>
                    <th>Blood Type</th>
                    <th>Available Units</th>
                </tr>
                </thead>
                <tbody>
                {bloodInventory.map((item, index) => (
                    <tr key={index}>
                        <td>{item.bloodType}</td>
                        <td>{item.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BloodInventory;
