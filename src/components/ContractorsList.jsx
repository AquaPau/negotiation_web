import { Link } from 'react-router-dom'

function ContractorsList({ contractors }) {

  if (!contractors) {
    return <p>Данных о контрагентах не найдено.</p>;
  }

  return (

    <div className='contractors-list'>
      {contractors.map(contractor => (
        <div key={contractor.id} className='card'>
            <Link to={`/contractor/${contractor.id}`}>{contractor.customName}</Link>
        </div>
      ))}
    </div>
  )
}

export default ContractorsList